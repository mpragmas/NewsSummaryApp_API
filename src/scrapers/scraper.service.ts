import { Injectable, Logger } from '@nestjs/common';
import type { NormalizedArticle } from '../rss/rss.service';
import { scrapeIgihe } from './igihe.scraper';
import { scrapeKigaliToday } from './kigalitoday.scraper';

const CACHE_TTL_MS = 20 * 60 * 1000; // 20-minute page cache per source

interface ScraperCache {
  articles: NormalizedArticle[];
  fetchedAt: number;
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly cache = new Map<string, ScraperCache>();

  /** Run all scrapers concurrently with per-source in-memory caching. */
  async scrapeAll(): Promise<NormalizedArticle[]> {
    this.logger.log('🕷️  Starting scrapers: Igihe + Kigali Today');

    const [igiheArticles, kigaliTodayArticles] = await Promise.all([
      this.cachedScrape('igihe', () => scrapeIgihe(this.logger)),
      this.cachedScrape('kigalitoday', () => scrapeKigaliToday(this.logger)),
    ]);

    const total = igiheArticles.length + kigaliTodayArticles.length;
    this.logger.log(
      `🕷️  Scrapers done: ${igiheArticles.length} Igihe + ${kigaliTodayArticles.length} KigaliToday = ${total} total`,
    );

    return [...igiheArticles, ...kigaliTodayArticles];
  }

  private async cachedScrape(
    key: string,
    fn: () => Promise<NormalizedArticle[]>,
  ): Promise<NormalizedArticle[]> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      this.logger.debug(`🕷️  ${key}: serving ${cached.articles.length} articles from cache`);
      return cached.articles;
    }

    try {
      const articles = await fn();
      this.cache.set(key, { articles, fetchedAt: Date.now() });
      return articles;
    } catch (err) {
      this.logger.error(`🕷️  ${key} scraper failed: ${(err as Error).message}`);
      // Return stale cache if available rather than nothing
      return cached?.articles ?? [];
    }
  }
}
