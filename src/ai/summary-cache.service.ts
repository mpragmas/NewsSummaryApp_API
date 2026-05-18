import { createHash } from 'crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { ProviderName } from './providers/ai-provider.interface';
import { SupportedLang } from './prompts';

/**
 * Cache key derived from (title + content prefix + language). Ingestion
 * frequently re-fetches the same RSS items, and many sources duplicate
 * stories under different URLs — this dedupes the AI call.
 */
const CACHE_PREFIX = 'ai:summary:v1';
/** 7 days. Adjust if you want fresher re-summaries. */
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1_000;

export interface CachedSummary {
  text: string;
  provider: ProviderName;
  cachedAt: number;
}

@Injectable()
export class SummaryCacheService {
  private readonly logger = new Logger(SummaryCacheService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  static keyFor(
    title: string,
    content: string,
    language: SupportedLang,
  ): string {
    const hash = createHash('sha256')
      .update(language)
      .update('|')
      .update((title ?? '').trim().toLowerCase())
      .update('|')
      .update((content ?? '').slice(0, 500))
      .digest('hex');
    return `${CACHE_PREFIX}:${hash}`;
  }

  async get(
    title: string,
    content: string,
    language: SupportedLang,
  ): Promise<CachedSummary | null> {
    const key = SummaryCacheService.keyFor(title, content, language);
    try {
      const hit = await this.cache.get<CachedSummary>(key);
      return hit ?? null;
    } catch (err) {
      this.logger.warn(`Cache read failed: ${(err as Error).message}`);
      return null;
    }
  }

  async set(
    title: string,
    content: string,
    language: SupportedLang,
    value: Omit<CachedSummary, 'cachedAt'>,
  ): Promise<void> {
    const key = SummaryCacheService.keyFor(title, content, language);
    try {
      await this.cache.set(
        key,
        { ...value, cachedAt: Date.now() } satisfies CachedSummary,
        CACHE_TTL_MS,
      );
    } catch (err) {
      this.logger.warn(`Cache write failed: ${(err as Error).message}`);
    }
  }
}
