import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Bottleneck from 'bottleneck';

import {
  ProviderFatalError,
  ProviderTransientError,
  RateLimitError,
} from '../../common/errors/rate-limit.error';
import { estimateRequestTokens } from '../../common/util/token-estimate';
import { buildPrompt, MAX_OUTPUT_TOKENS } from '../prompts';
import { AiProvider, SummarizeInput } from './ai-provider.interface';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_TIMEOUT_MS = 15_000;

@Injectable()
export class GroqProvider implements AiProvider {
  readonly name = 'groq' as const;
  readonly model: string;
  readonly enabled: boolean;

  private readonly logger = new Logger(GroqProvider.name);
  private readonly apiKey: string;

  // Token reservoir (TPM) and request rate (RPM). Defaults are tuned to
  // stay UNDER the Groq free tier published limits on llama-3.1-8b-instant.
  private readonly limiter: Bottleneck;
  private readonly tokenReservoir: Bottleneck;

  constructor(config: ConfigService) {
    this.apiKey = (config.get<string>('GROQ_API_KEY') ?? '').trim();
    this.model =
      config.get<string>('GROQ_MODEL') ?? 'llama-3.1-8b-instant';
    this.enabled = !!this.apiKey;

    const rpm = config.get<number>('rateLimit.groqRpm') ?? 25;
    const tpm = config.get<number>('rateLimit.groqTpm') ?? 5_500;

    // Limits requests-per-second; one in-flight at a time keeps things sane.
    this.limiter = new Bottleneck({
      reservoir: rpm,
      reservoirRefreshAmount: rpm,
      reservoirRefreshInterval: 60_000,
      maxConcurrent: 1,
      minTime: Math.ceil(60_000 / rpm),
    });

    // Separate reservoir for tokens — every call pre-pays its estimated cost.
    this.tokenReservoir = new Bottleneck({
      reservoir: tpm,
      reservoirRefreshAmount: tpm,
      reservoirRefreshInterval: 60_000,
      maxConcurrent: 1,
    });

    if (this.enabled) {
      this.logger.log(
        `Groq enabled (${this.model}); ${rpm} req/min, ${tpm} tok/min`,
      );
    } else {
      this.logger.warn('GROQ_API_KEY missing — Groq provider disabled');
    }
  }

  async summarize(input: SummarizeInput): Promise<string> {
    if (!this.enabled) throw new ProviderFatalError('groq', 'not_configured');

    const prompt = buildPrompt(
      input.title,
      input.content,
      input.url,
      input.language,
    );
    const cost = estimateRequestTokens(prompt, MAX_OUTPUT_TOKENS);

    // Pre-pay token cost so concurrent calls share the per-minute budget.
    await this.tokenReservoir.schedule({ weight: cost }, () =>
      Promise.resolve(),
    );

    return this.limiter.schedule(() => this.callGroq(prompt, input));
  }

  private async callGroq(
    prompt: string,
    input: SummarizeInput,
  ): Promise<string> {
    const shortTitle = input.title.slice(0, 60);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

    try {
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: MAX_OUTPUT_TOKENS,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        const retryAfterMs = parseRetryAfter(response.headers, body);

        if (response.status === 429 || retryAfterMs > 0) {
          throw new RateLimitError(
            'groq',
            retryAfterMs || 5_000,
            `Groq 429: ${truncate(body)}`,
          );
        }
        if (response.status === 401 || response.status === 403) {
          throw new ProviderFatalError('groq', `auth_${response.status}`, body);
        }
        if (
          /decommissioned|deprecated|model_not_found/i.test(body) ||
          response.status === 404
        ) {
          throw new ProviderFatalError(
            'groq',
            'model_decommissioned',
            truncate(body),
          );
        }
        throw new ProviderTransientError(
          'groq',
          `http_${response.status}`,
          truncate(body),
        );
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (!text) {
        throw new ProviderTransientError('groq', 'empty_response');
      }

      this.logger.log(`Groq OK "${shortTitle}" [${input.language}]`);
      return text;
    } catch (err) {
      if (
        err instanceof RateLimitError ||
        err instanceof ProviderFatalError ||
        err instanceof ProviderTransientError
      ) {
        throw err;
      }
      const e = err as Error;
      if (e.name === 'AbortError' || /timeout/i.test(e.message)) {
        throw new ProviderTransientError('groq', 'timeout', e.message);
      }
      throw new ProviderTransientError('groq', 'network_error', e.message);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

function parseRetryAfter(headers: Headers, body: string): number {
  const h = headers.get('retry-after');
  if (h) {
    const n = Number(h);
    if (Number.isFinite(n) && n > 0) return n * 1_000;
    const date = Date.parse(h);
    if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
  }
  // Groq sometimes returns "Please try again in 9.123s" in the body.
  const m = body.match(/try again in ([0-9.]+)s/i);
  if (m) return Math.ceil(parseFloat(m[1]) * 1_000);
  return 0;
}

function truncate(s: string, n = 200): string {
  return s.length > n ? s.slice(0, n) + '…' : s;
}

// Reference: Groq stays well under the published 6k TPM / 30 RPM free tier.
// Adjust GROQ_RPM / GROQ_TPM env vars if you upgrade to a paid plan.
