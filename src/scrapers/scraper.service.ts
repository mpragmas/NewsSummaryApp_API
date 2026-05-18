import { Injectable, Logger } from '@nestjs/common';
import type { NormalizedArticle } from '../rss/rss.service';
import { scrapeIgihe, type RwScrapeResult } from './igihe.scraper';
import { scrapeKigaliToday } from './kigalitoday.scraper';
import { getRwPipelineMetrics, recordRwScrapeBatch } from '../common/util/rw-pipeline-metrics';

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

    const [igiheResult, kigaliTodayResult] = await Promise.all([
      this.cachedScrape('igihe', () => scrapeIgihe(this.logger)),
      this.cachedScrape('kigalitoday', () => scrapeKigaliToday(this.logger)),
    ]);

    const merged = [...igiheResult.articles, ...kigaliTodayResult.articles];
    const scrapedTotal = igiheResult.scrapedTotal + kigaliTodayResult.scrapedTotal;
    const rejectedInvalid =
      igiheResult.rejectedInvalid + kigaliTodayResult.rejectedInvalid;
    const rejectedLowQuality =
      igiheResult.rejectedLowQuality + kigaliTodayResult.rejectedLowQuality;
    recordRwScrapeBatch({
      scrapedTotal,
      rejectedInvalid,
      rejectedLowQuality,
    });
    const snapshot = getRwPipelineMetrics();
    const rejected = rejectedInvalid + rejectedLowQuality;

    this.logger.log(
      `🕷️  Scrapers done: ${igiheResult.articles.length} Igihe + ${kigaliTodayResult.articles.length} KigaliToday accepted`,
    );
    this.logger.log(
      `[RW PIPELINE] scraped=${snapshot.rwScrapedTotal}, rejected=${snapshot.rwRejectedInvalid + snapshot.rwRejectedLowQuality}, ai=${snapshot.rwAIEnhanced}, fallback=${snapshot.rwFallbackUsed} (batchRejected=${rejected}, lowQuality=${rejectedLowQuality})`,
    );

    return merged;
  }

  private async cachedScrape(
    key: string,
    fn: () => Promise<RwScrapeResult>,
  ): Promise<RwScrapeResult> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      this.logger.debug(`🕷️  ${key}: serving ${cached.articles.length} articles from cache`);
      return {
        articles: cached.articles,
        scrapedTotal: cached.articles.length,
        rejectedInvalid: 0,
        rejectedLowQuality: 0,
      };
    }

    try {
      const result = await fn();
      this.cache.set(key, { articles: result.articles, fetchedAt: Date.now() });
      return result;
    } catch (err) {
      this.logger.error(`🕷️  ${key} scraper failed: ${(err as Error).message}`);
      // Return stale cache if available rather than nothing
      return {
        articles: cached?.articles ?? [],
        scrapedTotal: 0,
        rejectedInvalid: 0,
        rejectedLowQuality: 0,
      };
    }
  }
}
