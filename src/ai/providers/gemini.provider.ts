import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Bottleneck from 'bottleneck';

import {
  ProviderFatalError,
  ProviderTransientError,
  RateLimitError,
} from '../../common/errors/rate-limit.error';
import { estimateRequestTokens } from '../../common/util/token-estimate';
import { buildPrompt, MAX_OUTPUT_TOKENS } from '../prompts';
import { AiProvider, SummarizeInput } from './ai-provider.interface';

const GEMINI_TIMEOUT_MS = 20_000;

@Injectable()
export class GeminiProvider implements AiProvider {
  readonly name = 'gemini' as const;
  readonly model: string;
  readonly enabled: boolean;

  private readonly logger = new Logger(GeminiProvider.name);
  private readonly client: GoogleGenerativeAI | null = null;
  private readonly limiter: Bottleneck;
  private readonly tokenReservoir: Bottleneck;

  constructor(config: ConfigService) {
    const apiKey = (config.get<string>('GEMINI_API_KEY') ?? '').trim();
    this.model = config.get<string>('GEMINI_MODEL') ?? 'gemini-2.0-flash';
    this.enabled = !!apiKey;

    if (apiKey) this.client = new GoogleGenerativeAI(apiKey);

    const rpm = config.get<number>('rateLimit.geminiRpm') ?? 12;
    const tpm = config.get<number>('rateLimit.geminiTpm') ?? 800_000;

    this.limiter = new Bottleneck({
      reservoir: rpm,
      reservoirRefreshAmount: rpm,
      reservoirRefreshInterval: 60_000,
      maxConcurrent: 1,
      minTime: Math.ceil(60_000 / rpm),
    });

    // No maxConcurrent here: the reservoir (token budget) already throttles throughput,
    // and setting maxConcurrent:1 would reject any schedule({ weight > 1 }) call.
    this.tokenReservoir = new Bottleneck({
      reservoir: tpm,
      reservoirRefreshAmount: tpm,
      reservoirRefreshInterval: 60_000,
    });

    if (this.enabled) {
      this.logger.log(
        `Gemini enabled (${this.model}); ${rpm} req/min, ${tpm} tok/min`,
      );
    } else {
      this.logger.warn('GEMINI_API_KEY missing — Gemini provider disabled');
    }
  }

  async summarize(input: SummarizeInput): Promise<string> {
    if (!this.enabled || !this.client) {
      throw new ProviderFatalError('gemini', 'not_configured');
    }

    const prompt = buildPrompt(
      input.title,
      input.content,
      input.url,
      input.language,
      { strictRw: input.strictRw },
    );
    const cost = estimateRequestTokens(prompt, MAX_OUTPUT_TOKENS);

    await this.tokenReservoir.schedule({ weight: cost }, () =>
      Promise.resolve(),
    );

    return this.limiter.schedule(() => this.callGemini(prompt, input));
  }

  private async callGemini(
    prompt: string,
    input: SummarizeInput,
  ): Promise<string> {
    const shortTitle = input.title.slice(0, 60);

    try {
      const model = this.client!.getGenerativeModel({
        model: this.model,
        generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.3 },
      });

      const response = await Promise.race([
        model.generateContent(prompt),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Gemini timeout')),
            GEMINI_TIMEOUT_MS,
          ),
        ),
      ]);

      const text =
        response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text) throw new ProviderTransientError('gemini', 'empty_response');

      this.logger.log(`Gemini OK "${shortTitle}" [${input.language}]`);
      return text;
    } catch (err) {
      if (
        err instanceof RateLimitError ||
        err instanceof ProviderFatalError ||
        err instanceof ProviderTransientError
      ) {
        throw err;
      }
      const e = err as Error & { status?: number };
      const msg = (e.message || '').toLowerCase();

      if (
        msg.includes('429') ||
        msg.includes('rate limit') ||
        msg.includes('quota') ||
        msg.includes('exhausted') ||
        e.status === 429
      ) {
        const retryAfterMs = extractRetryAfterFromMessage(e.message) || 30_000;
        throw new RateLimitError('gemini', retryAfterMs, e.message);
      }
      if (
        msg.includes('401') ||
        msg.includes('403') ||
        msg.includes('permission denied') ||
        msg.includes('invalid api key')
      ) {
        throw new ProviderFatalError('gemini', 'auth_error', e.message);
      }
      if (msg.includes('decommissioned') || msg.includes('deprecated')) {
        throw new ProviderFatalError(
          'gemini',
          'model_decommissioned',
          e.message,
        );
      }
      if (msg.includes('timeout') || msg.includes('aborted')) {
        throw new ProviderTransientError('gemini', 'timeout', e.message);
      }
      throw new ProviderTransientError('gemini', 'unknown', e.message);
    }
  }
}

function extractRetryAfterFromMessage(message: string): number {
  const m = message.match(/retry[_ ]?in[: ]+([0-9.]+)\s*s/i);
  if (m) return Math.ceil(parseFloat(m[1]) * 1_000);
  return 0;
}
