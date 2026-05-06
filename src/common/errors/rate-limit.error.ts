/**
 * Thrown when an LLM provider rejects with a quota / rate-limit signal.
 * The orchestrator and queue retry logic key off `retryAfterMs` to avoid
 * pummeling a provider that has already said "wait".
 */
export class RateLimitError extends Error {
  readonly name = 'RateLimitError';

  constructor(
    public readonly provider: string,
    public readonly retryAfterMs: number,
    message?: string,
  ) {
    super(
      message ??
        `${provider} rate limited; retry after ${Math.round(retryAfterMs / 1000)}s`,
    );
  }
}

/** Permanent provider failure (auth, model decommissioned, etc.). Do NOT retry. */
export class ProviderFatalError extends Error {
  readonly name = 'ProviderFatalError';

  constructor(
    public readonly provider: string,
    public readonly reason: string,
    message?: string,
  ) {
    super(message ?? `${provider} fatal: ${reason}`);
  }
}

/** Transient failure (network, 5xx, timeout). Safe to retry. */
export class ProviderTransientError extends Error {
  readonly name = 'ProviderTransientError';

  constructor(
    public readonly provider: string,
    public readonly reason: string,
    message?: string,
  ) {
    super(message ?? `${provider} transient: ${reason}`);
  }
}

export function isRetryable(err: unknown): boolean {
  return err instanceof RateLimitError || err instanceof ProviderTransientError;
}
