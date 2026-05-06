import { Injectable, Logger } from '@nestjs/common';

import {
  ProviderFatalError,
  RateLimitError,
} from '../common/errors/rate-limit.error';
import { withRetry } from '../common/util/retry';
import { FallbackProvider } from './providers/fallback.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { GroqProvider } from './providers/groq.provider';
import { ProviderName, SummarizeInput } from './providers/ai-provider.interface';
import { SummaryCacheService } from './summary-cache.service';

export interface OrchestratedSummary {
  text: string;
  provider: ProviderName;
  cached: boolean;
}

interface Cooldown {
  provider: ProviderName;
  until: number;
  reason: string;
}

/**
 * Single source of truth for "give me a summary of this article".
 *
 *  - Cache first (Redis-backed, hashed by content+lang)
 *  - Groq → Gemini → local fallback. Each gets ONE attempt per call.
 *  - Honors per-provider cooldown windows after a 429 / quota signal so
 *    we don't keep slamming the same provider that just rate-limited us.
 *  - Wraps each network attempt in `withRetry()` for transient failures.
 *  - NEVER returns empty: local fallback is always last resort.
 */
@Injectable()
export class AiOrchestratorService {
  private readonly logger = new Logger(AiOrchestratorService.name);
  private readonly cooldowns = new Map<ProviderName, Cooldown>();

  constructor(
    private readonly groq: GroqProvider,
    private readonly gemini: GeminiProvider,
    private readonly fallback: FallbackProvider,
    private readonly cache: SummaryCacheService,
  ) {}

  async summarize(input: SummarizeInput): Promise<OrchestratedSummary> {
    const cached = await this.cache.get(
      input.title,
      input.content,
      input.language,
    );
    if (cached) {
      this.logger.debug(
        `Cache hit for "${input.title.slice(0, 40)}" [${input.language}] (provider: ${cached.provider})`,
      );
      return { text: cached.text, provider: cached.provider, cached: true };
    }

    const order: Array<GroqProvider | GeminiProvider> = [this.groq, this.gemini];

    for (const provider of order) {
      if (!provider.enabled) continue;
      if (this.isInCooldown(provider.name)) {
        this.logger.debug(
          `Skip ${provider.name} (cooldown until ${this.cooldowns.get(provider.name)?.until})`,
        );
        continue;
      }

      try {
        const text = await withRetry(
          () => provider.summarize(input),
          {
            attempts: 2,
            baseDelayMs: 1_500,
            maxDelayMs: 6_000,
            label: provider.name,
            logger: this.logger,
          },
        );

        await this.cache.set(input.title, input.content, input.language, {
          text,
          provider: provider.name,
        });
        return { text, provider: provider.name, cached: false };
      } catch (err) {
        if (err instanceof RateLimitError) {
          this.startCooldown(provider.name, err.retryAfterMs, '429');
          this.logger.warn(
            `${provider.name} rate-limited; cooling down ${Math.round(err.retryAfterMs / 1000)}s and trying next provider.`,
          );
          continue;
        }
        if (err instanceof ProviderFatalError) {
          // Treat fatal errors as a long cooldown so we stop hammering
          // a misconfigured provider for the rest of this process.
          this.startCooldown(provider.name, 60 * 60 * 1_000, err.reason);
          this.logger.error(
            `${provider.name} fatal: ${err.reason} — disabling for 1h`,
          );
          continue;
        }

        this.logger.warn(
          `${provider.name} transient error after retries: ${(err as Error).message} — trying next provider`,
        );
      }
    }

    // Last resort — never throws, always returns a string.
    const text = await this.fallback.summarize(input);
    return { text, provider: 'fallback', cached: false };
  }

  /** Snapshot for /health or admin diagnostics. */
  getProviderStatus() {
    return {
      groq: this.providerStatus(this.groq),
      gemini: this.providerStatus(this.gemini),
      fallback: { enabled: true, model: this.fallback.model },
    };
  }

  private providerStatus(p: GroqProvider | GeminiProvider) {
    const cd = this.cooldowns.get(p.name);
    const inCooldown = cd ? cd.until > Date.now() : false;
    return {
      enabled: p.enabled,
      model: p.model,
      cooldownActive: inCooldown,
      cooldownUntil: inCooldown ? new Date(cd!.until).toISOString() : null,
      cooldownReason: inCooldown ? cd!.reason : null,
    };
  }

  private isInCooldown(name: ProviderName): boolean {
    const cd = this.cooldowns.get(name);
    if (!cd) return false;
    if (cd.until <= Date.now()) {
      this.cooldowns.delete(name);
      return false;
    }
    return true;
  }

  private startCooldown(name: ProviderName, ms: number, reason: string) {
    const until = Date.now() + Math.max(ms, 1_000);
    this.cooldowns.set(name, { provider: name, until, reason });
  }
}
