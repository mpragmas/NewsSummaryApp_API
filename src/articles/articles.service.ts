import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { RssService, NormalizedArticle } from '../rss/rss.service';
import { AiService } from '../ai/ai.service';
import { fallbackSummary } from '../ai/fallback-summary.util';
import { ScraperService } from '../scrapers/scraper.service';
import { CategorizerService } from './categorizer.service';
import { DeduplicationService } from './deduplication.service';
import { Prisma } from '../generated/prisma';
import { QueryArticlesDto } from './dto/query-articles.dto';
import {
  PaginatedArticlesDto,
  ArticleResponseDto,
} from './dto/article-response.dto';
import { UsersService } from '../users/users.service';

const CACHE_PREFIX = 'articles';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export interface IngestResult {
  processed: number;
  saved: number;
  summarized: number;
  aiSummarized: number;
  fallbackUsed: number;
  failed: number;
  durationMs: number;
}

export interface BackfillFrenchResult {
  total: number;
  summarized: number;
  aiSummarized: number;
  fallbackUsed: number;
  errors: number;
}

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rssService: RssService,
    private readonly aiService: AiService,
    private readonly categorizer: CategorizerService,
    private readonly deduplication: DeduplicationService,
    private readonly usersService: UsersService,
    private readonly scraperService: ScraperService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(
    query: QueryArticlesDto,
    userId?: string,
  ): Promise<PaginatedArticlesDto> {
    const cacheKey = `${CACHE_PREFIX}:${JSON.stringify({ ...query, _u: userId ?? null })}`;

    try {
      const cached =
        await this.cacheManager.get<PaginatedArticlesDto>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      this.logger.warn(
        `Cache read failed (continuing without cache): ${(err as Error).message}`,
      );
    }

    const personal = userId
      ? await this.usersService.getPersonalizationForFeed(userId)
      : null;
    const {
      page = 1,
      limit = 20,
      sortBy = 'publishedAt',
      order = 'desc',
      lang,
      query: searchText,
      category,
      country,
      continent,
      region,
      source,
    } = query;
    const skip = (page - 1) * limit;

    // lang controls WHICH summary field is shown (applyLanguageView),
    // NOT which articles are filtered. Use region/country/continent for discovery.
    const effectiveLang = (lang ?? personal?.preferredLanguage) as
      | 'en'
      | 'fr'
      | 'rw'
      | undefined;

    const where: Prisma.ArticleWhereInput = {};

    const andFilters: Prisma.ArticleWhereInput[] = [];

    const q = searchText?.trim();
    if (q) {
      andFilters.push({
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { summary: { contains: q, mode: 'insensitive' } },
          { summaryFr: { contains: q, mode: 'insensitive' } },
          { summaryRw: { contains: q, mode: 'insensitive' } },
          { content: { contains: q, mode: 'insensitive' } },
        ],
      });
    }

    if (category) {
      andFilters.push({ category });
    } else if (personal?.favoriteTopics?.length) {
      andFilters.push({ category: { in: personal.favoriteTopics } });
    }
    if (country) andFilters.push({ country });
    if (continent) andFilters.push({ continent });
    if (region) andFilters.push({ region });
    if (source) andFilters.push({ source });

    if (andFilters.length) {
      where.AND = andFilters;
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      this.prisma.article.count({ where }),
    ]);

    const mappedData = articles.map((a) =>
      this.normalizeArticleResponse(
        this.applyLanguageView(a as ArticleResponseDto, effectiveLang),
      ),
    );

    const result: PaginatedArticlesDto = {
      data: mappedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    try {
      await this.cacheManager.set(cacheKey, result, CACHE_TTL);
    } catch (err) {
      this.logger.warn(
        `Cache write failed (non-fatal): ${(err as Error).message}`,
      );
    }

    return result;
  }

  async findOne(id: string, lang?: 'en' | 'fr' | 'rw'): Promise<ArticleResponseDto> {
    const cacheKey = `${CACHE_PREFIX}:${id}:${lang ?? 'default'}`;

    try {
      const cached = await this.cacheManager.get<ArticleResponseDto>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      this.logger.warn(
        `Cache read failed (continuing without cache): ${(err as Error).message}`,
      );
    }

    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException(`Article ${id} not found`);

    const result = this.normalizeArticleResponse(
      this.applyLanguageView(article as ArticleResponseDto, lang),
    );

    try {
      await this.cacheManager.set(cacheKey, result, CACHE_TTL);
    } catch (err) {
      this.logger.warn(
        `Cache write failed (non-fatal): ${(err as Error).message}`,
      );
    }

    return result;
  }

  async summarizeOne(
    id: string,
    lang?: 'en' | 'fr' | 'rw',
  ): Promise<ArticleResponseDto> {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException(`Article ${id} not found`);

    const targetLang =
      lang ?? (article.originalLanguage as 'en' | 'fr' | 'rw') ?? 'en';
    const result = await this.aiService.summarizeArticle(
      article.title,
      article.content,
      article.url,
      targetLang,
    );

    const updateData =
      targetLang === 'fr'
        ? { summaryFr: result.text }
        : targetLang === 'rw'
          ? { summaryRw: result.text }
          : { summary: result.text };

    const updated = await this.prisma.article.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(
      `🔁 Re-summarized ${id} [${targetLang}] via ${result.provider}`,
    );

    try {
      await this.cacheManager.del(`${CACHE_PREFIX}:${id}:default`);
      await this.cacheManager.del(`${CACHE_PREFIX}:${id}:en`);
      await this.cacheManager.del(`${CACHE_PREFIX}:${id}:fr`);
      await this.cacheManager.del(`${CACHE_PREFIX}:${id}:rw`);
    } catch (err) {
      this.logger.warn(
        `Cache invalidation failed (non-fatal): ${(err as Error).message}`,
      );
    }

    return this.normalizeArticleResponse(
      this.applyLanguageView(updated as ArticleResponseDto, targetLang),
    );
  }

  /**
   * Full ingestion pipeline. Fetches RSS + scraped articles, deduplicates,
   * summarizes in original language, and persists. Never throws.
   */
  async ingest(): Promise<IngestResult> {
    const startedAt = Date.now();
    this.logger.log('🔄 Ingestion pipeline started');

    // ── 1. Fetch RSS feeds + scrapers in TRUE parallel ────────────────────
    const [rssResult, scraperResult] = await Promise.allSettled([
      this.rssService.fetchAllFeeds(),
      this.scraperService.scrapeAll(),
    ]);

    const rssArticles: NormalizedArticle[] =
      rssResult.status === 'fulfilled'
        ? rssResult.value
        : (this.logger.error(`❌ RSS fetch failed: ${rssResult.reason}`), []);

    const scrapedArticles: NormalizedArticle[] =
      scraperResult.status === 'fulfilled'
        ? scraperResult.value
        : (this.logger.error(`❌ Scraper failed: ${scraperResult.reason}`), []);

    this.logger.log(
      `📥 Fetched: ${rssArticles.length} RSS + ${scrapedArticles.length} scraped`,
    );

    const rawArticles = [...rssArticles, ...scrapedArticles];

    if (rawArticles.length === 0) {
      this.logger.warn(
        '⚠️  No articles fetched — pipeline complete with 0 results',
      );
      return this.emptyResult(startedAt);
    }

    // ── 3. Deduplicate ────────────────────────────────────────────────────
    let uniqueArticles: NormalizedArticle[] = rawArticles;
    try {
      uniqueArticles = await this.deduplication.filterDuplicates(rawArticles);
      this.logger.log(
        `🔍 Deduplication: ${uniqueArticles.length} unique (removed ${rawArticles.length - uniqueArticles.length} duplicates)`,
      );
    } catch (err) {
      this.logger.error(
        `❌ Deduplication failed: ${(err as Error).message} — proceeding with raw articles`,
      );
    }

    if (uniqueArticles.length === 0) {
      this.logger.log(
        '✅ No new articles to process (all duplicates) — pipeline complete',
      );
      return this.emptyResult(startedAt);
    }

    // ── 4. Categorize ─────────────────────────────────────────────────────
    const articlesWithCategory = uniqueArticles.map((a) => ({
      ...a,
      category: this.safeCategorize(a.title, a.content),
    }));
    this.logger.log(`🏷️  Categorized ${articlesWithCategory.length} articles`);

    // ── 5. Summarize in each article's original language ──────────────────
    this.logger.log(
      `🤖 Requesting summaries for ${articlesWithCategory.length} articles…`,
    );
    const summaries = await this.aiService.summarizeBatch(
      articlesWithCategory.map((a) => ({
        title: a.title,
        content: a.content,
        url: a.url,
        language: this.toSupportedLang(a.originalLanguage),
      })),
    );

    // Belt-and-braces: force local fallback on any empty result
    const guaranteedSummaries = summaries.map((s, idx) => {
      const article = articlesWithCategory[idx];
      if (!s?.text || s.text.trim().length === 0) {
        this.logger.warn(
          `⚠️  Empty summary slipped through for "${article.title.substring(0, 50)}" — forcing local fallback`,
        );
        return {
          text: fallbackSummary(
            article.content,
            article.title,
            article.url,
            this.toSupportedLang(article.originalLanguage),
          ),
          provider: 'fallback' as const,
        };
      }
      return s;
    });

    const aiSummarized = guaranteedSummaries.filter(
      (s) => s.provider === 'groq' || s.provider === 'gemini',
    ).length;
    const fallbackUsed = guaranteedSummaries.filter(
      (s) => s.provider === 'fallback',
    ).length;
    const summarized = guaranteedSummaries.length;

    if (fallbackUsed > 0) {
      this.logger.warn(
        `⚠️  ${fallbackUsed}/${summarized} articles used local fallback — AI providers degraded`,
      );
    }

    // ── 6. Persist — route summary to correct language column ─────────────
    const insertData = articlesWithCategory
      .map((article, idx) => {
        const lang = article.originalLanguage;
        const summaryText = guaranteedSummaries[idx].text;
        const cleanUrl = article.url.trim();
        if (!cleanUrl) return null; // skip articles with no URL

        return {
          title: article.title.trim().substring(0, 1000),
          content: article.content.trim() || article.title,
          summary: lang === 'en' ? summaryText : null,
          summaryFr: lang === 'fr' ? summaryText : null,
          summaryRw: lang === 'rw' ? summaryText : null,
          originalLanguage: article.originalLanguage,
          source: article.source,
          url: cleanUrl,
          imageUrl: article.imageUrl,
          category: article.category,
          continent: article.continent,
          region: article.region,
          country: article.country,
          publishedAt: article.publishedAt,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    let saved = 0;
    let failed = 0;

    try {
      const result = await this.prisma.article.createMany({
        data: insertData,
        skipDuplicates: true,
      });
      saved = result.count;
    } catch (err) {
      this.logger.error(
        `❌ createMany failed: ${(err as Error).message} — falling back to individual upserts`,
      );

      for (const record of insertData) {
        try {
          await this.prisma.article.upsert({
            where: { url: record.url },
            update: {},
            create: record,
          });
          saved++;
        } catch (innerErr) {
          this.logger.error(
            `❌ Failed to save "${record.title.substring(0, 50)}": ${(innerErr as Error).message}`,
          );
          failed++;
        }
      }
    }

    // ── 7. Cache invalidation ─────────────────────────────────────────────
    await this.invalidateListCache();

    const durationMs = Date.now() - startedAt;
    this.logger.log(
      `✅ Ingestion complete in ${durationMs}ms — processed: ${uniqueArticles.length}, ` +
        `saved: ${saved}, summarized: ${summarized} (AI: ${aiSummarized}, fallback: ${fallbackUsed}), db errors: ${failed}`,
    );

    return {
      processed: uniqueArticles.length,
      saved,
      summarized,
      aiSummarized,
      fallbackUsed,
      failed,
      durationMs,
    };
  }

  /**
   * Backfill EN summaries for articles that still have a null summary.
   */
  async resummarizeUnsummarized(): Promise<{
    total: number;
    summarized: number;
    aiSummarized: number;
    fallbackUsed: number;
    errors: number;
  }> {
    const unsummarized = await this.prisma.article.findMany({
      where: { summary: null, originalLanguage: 'en' },
      select: { id: true, title: true, content: true, url: true },
    });

    if (unsummarized.length === 0) {
      this.logger.log('All English articles already have summaries');
      return { total: 0, summarized: 0, aiSummarized: 0, fallbackUsed: 0, errors: 0 };
    }

    this.logger.log(
      `Found ${unsummarized.length} English articles without summaries — backfilling…`,
    );

    const summaries = await this.aiService.summarizeBatch(
      unsummarized.map((a) => ({
        title: a.title,
        content: a.content,
        url: a.url,
        language: 'en' as const,
      })),
    );

    let summarized = 0;
    let aiSummarized = 0;
    let fallbackUsed = 0;
    let errors = 0;

    for (let i = 0; i < unsummarized.length; i++) {
      const article = unsummarized[i];
      const result = summaries[i] ?? {
        text: fallbackSummary(article.content, article.title, article.url, 'en'),
        provider: 'fallback' as const,
      };

      try {
        await this.prisma.article.update({
          where: { id: article.id },
          data: { summary: result.text },
        });
        summarized++;
        if (result.provider === 'fallback') fallbackUsed++;
        else aiSummarized++;
      } catch (err) {
        this.logger.error(
          `Failed to update article ${article.id}: ${(err as Error).message}`,
        );
        errors++;
      }
    }

    await this.invalidateListCache();
    this.logger.log(
      `Re-summarization complete: ${summarized} (AI: ${aiSummarized}, fallback: ${fallbackUsed}), ${errors} errors`,
    );

    return { total: unsummarized.length, summarized, aiSummarized, fallbackUsed, errors };
  }

  /**
   * Backfill French summaries for all articles that are missing summaryFr.
   */
  async backfillFrench(): Promise<BackfillFrenchResult> {
    const missing = await this.prisma.article.findMany({
      where: { summaryFr: null },
      select: { id: true, title: true, content: true, url: true, originalLanguage: true },
    });

    if (missing.length === 0) {
      this.logger.log('✅ All articles already have French summaries');
      return { total: 0, summarized: 0, aiSummarized: 0, fallbackUsed: 0, errors: 0 };
    }

    this.logger.log(
      `🇫🇷 Backfilling French summaries for ${missing.length} articles…`,
    );

    const summaries = await this.aiService.summarizeBatch(
      missing.map((a) => ({ title: a.title, content: a.content, url: a.url, language: 'fr' as const })),
    );

    let summarized = 0;
    let aiSummarized = 0;
    let fallbackUsed = 0;
    let errors = 0;

    for (let i = 0; i < missing.length; i++) {
      const article = missing[i];
      const result = summaries[i] ?? {
        text: fallbackSummary(article.content, article.title, article.url, 'fr'),
        provider: 'fallback' as const,
      };

      try {
        await this.prisma.article.update({
          where: { id: article.id },
          data: { summaryFr: result.text },
        });
        summarized++;
        if (result.provider === 'fallback') fallbackUsed++;
        else aiSummarized++;
      } catch (err) {
        this.logger.error(
          `Failed to update French summary for ${article.id}: ${(err as Error).message}`,
        );
        errors++;
      }
    }

    await this.invalidateListCache();
    this.logger.log(
      `🇫🇷 French backfill complete: ${summarized}/${missing.length} (AI: ${aiSummarized}, fallback: ${fallbackUsed}), ${errors} errors`,
    );

    return { total: missing.length, summarized, aiSummarized, fallbackUsed, errors };
  }

  /**
   * Backfill Kinyarwanda summaries for all Kinyarwanda articles missing summaryRw.
   */
  async backfillKinyarwanda(): Promise<BackfillFrenchResult> {
    const missing = await this.prisma.article.findMany({
      where: { summaryRw: null, originalLanguage: 'rw' },
      select: { id: true, title: true, content: true, url: true, originalLanguage: true },
    });

    if (missing.length === 0) {
      this.logger.log('✅ All Kinyarwanda articles already have summaryRw');
      return { total: 0, summarized: 0, aiSummarized: 0, fallbackUsed: 0, errors: 0 };
    }

    this.logger.log(
      `🇷🇼 Backfilling Kinyarwanda summaries for ${missing.length} articles…`,
    );

    const summaries = await this.aiService.summarizeBatch(
      missing.map((a) => ({ title: a.title, content: a.content, url: a.url, language: 'rw' as const })),
    );

    let summarized = 0;
    let aiSummarized = 0;
    let fallbackUsed = 0;
    let errors = 0;

    for (let i = 0; i < missing.length; i++) {
      const article = missing[i];
      const result = summaries[i] ?? {
        text: fallbackSummary(article.content, article.title, article.url, 'rw'),
        provider: 'fallback' as const,
      };

      try {
        await this.prisma.article.update({
          where: { id: article.id },
          data: { summaryRw: result.text },
        });
        summarized++;
        if (result.provider === 'fallback') fallbackUsed++;
        else aiSummarized++;
      } catch (err) {
        this.logger.error(
          `Failed to update Kinyarwanda summary for ${article.id}: ${(err as Error).message}`,
        );
        errors++;
      }
    }

    await this.invalidateListCache();
    this.logger.log(
      `🇷🇼 Kinyarwanda backfill complete: ${summarized}/${missing.length} (AI: ${aiSummarized}, fallback: ${fallbackUsed}), ${errors} errors`,
    );

    return { total: missing.length, summarized, aiSummarized, fallbackUsed, errors };
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  /**
   * Applies language view: sets `summary` to the requested language version
   * with a full three-way fallback chain. Never returns null when any summary exists.
   *
   * rw → summaryRw ?? summary ?? summaryFr
   * fr → summaryFr ?? summary ?? summaryRw
   * en → summary   ?? summaryFr ?? summaryRw
   */
  private applyLanguageView(
    article: ArticleResponseDto,
    lang?: 'en' | 'fr' | 'rw',
  ): ArticleResponseDto {
    if (!lang) return article;

    let requestedSummary: string | null;
    if (lang === 'rw') {
      requestedSummary = article.summaryRw ?? article.summary ?? article.summaryFr;
    } else if (lang === 'fr') {
      requestedSummary = article.summaryFr ?? article.summary ?? article.summaryRw;
    } else {
      requestedSummary = article.summary ?? article.summaryFr ?? article.summaryRw;
    }

    return { ...article, summary: requestedSummary };
  }

  /** Normalize any originalLanguage value to a supported AI/fallback language. */
  private toSupportedLang(lang: string): 'en' | 'fr' | 'rw' {
    if (lang === 'fr' || lang === 'rw') return lang;
    return 'en'; // default for 'en', 'unknown', or any unexpected value
  }

  private normalizeArticleResponse(
    article: ArticleResponseDto,
  ): ArticleResponseDto {
    return {
      ...article,
      imageUrl: this.normalizeImageUrl(article.imageUrl),
    };
  }

  private normalizeImageUrl(url: string | null | undefined): string | null {
    const trimmed = url?.trim();
    if (!trimmed) return null;
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return null;
      }
      return parsed.toString();
    } catch {
      return null;
    }
  }

  private emptyResult(startedAt: number): IngestResult {
    return {
      processed: 0,
      saved: 0,
      summarized: 0,
      aiSummarized: 0,
      fallbackUsed: 0,
      failed: 0,
      durationMs: Date.now() - startedAt,
    };
  }

  private safeCategorize(title: string, content: string): string {
    try {
      return this.categorizer.categorize(title, content);
    } catch (err) {
      this.logger.warn(
        `Categorization failed for "${title.substring(0, 40)}": ${(err as Error).message}`,
      );
      return 'General';
    }
  }

  private async invalidateListCache(): Promise<void> {
    try {
      await (
        this.cacheManager as Cache & { clear: () => Promise<void> }
      ).clear();
    } catch (error) {
      this.logger.warn(
        `Cache invalidation failed (non-fatal): ${(error as Error).message}`,
      );
    }
  }
}
