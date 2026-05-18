import { Logger } from '@nestjs/common';
import { RateLimitError, isRetryable } from '../errors/rate-limit.error';

export interface RetryOptions {
  attempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitter?: boolean;
  /** Optional logger label for traceability. */
  label?: string;
  logger?: Logger;
}

const DEFAULT_OPTS: RetryOptions = {
  attempts: 4,
  baseDelayMs: 1_000,
  maxDelayMs: 30_000,
  jitter: true,
};

/**
 * Exponential backoff with full jitter. Honors `RateLimitError.retryAfterMs`
 * so we never retry sooner than the provider asked us to.
 *
 * Only retries when {@link isRetryable} returns true; everything else is
 * surfaced immediately so the caller can fail-fast (e.g. auth errors).
 */
export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  opts: Partial<RetryOptions> = {},
): Promise<T> {
  const cfg = { ...DEFAULT_OPTS, ...opts };
  let lastErr: unknown;

  for (let attempt = 1; attempt <= cfg.attempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;

      if (!isRetryable(err) || attempt === cfg.attempts) {
        throw err;
      }

      const exp = Math.min(
        cfg.maxDelayMs,
        cfg.baseDelayMs * 2 ** (attempt - 1),
      );
      let delay = cfg.jitter ? Math.floor(Math.random() * exp) : exp;

      if (err instanceof RateLimitError && err.retryAfterMs > delay) {
        delay = err.retryAfterMs;
      }

      cfg.logger?.warn(
        `[retry${cfg.label ? ' ' + cfg.label : ''}] attempt ${attempt}/${cfg.attempts} failed (${(err as Error).message}); waiting ${delay}ms`,
      );

      await sleep(delay);
    }
  }

  throw lastErr;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
