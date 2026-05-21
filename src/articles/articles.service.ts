import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { RssService, NormalizedArticle } from '../rss/rss.service';
import { AiService } from '../ai/ai.service';
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
import { SummarizationQueueService } from '../queue/summarization.queue';
import { SummarizeArticleJobData } from '../queue/job-types';
import { SupportedLang } from '../ai/prompts';
import {
  getContentQualityScore,
  hasRealJournalisticContent,
  isValidArticle,
  normalizeText,
  sanitizeContentForAI,
} from '../common/util/article-validation';
import {
  dropOverusedImages,
  sanitizeImageUrl,
} from '../common/util/image-quality.util';
import {
  extractBestImageFromArticleHtml,
  fingerprintCanonicalImageUrl,
} from '../common/util/image-extractor.util';
import {
  formatImageIngestMetricsSummary,
  resetImageIngestMetrics,
} from '../common/util/image-ingest-metrics.util';
import { inferLocationFromText } from '../common/util/location-inference.util';
import {
  localizeCategory,
  normalizeCategoryInput,
  type CanonicalCategory,
} from './category-i18n.util';

const CACHE_PREFIX = 'articles';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export interface IngestResult {
  processed: number;
  saved: number;
  enqueued: number;
  failed: number;
  durationMs: number;
}

export interface BackfillResult {
  total: number;
  enqueued: number;
}

export interface RecategorizeResult {
  scanned: number;
  updated: number;
}

export interface ReindexMetadataResult {
  scanned: number;
  updated: number;
}

export interface ReindexImagesResult {
  scanned: number;
  updated: number;
  duplicatesNulled: number;
  durationMs: number;
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
    private readonly summarizationQueue: SummarizationQueueService,
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

    const effectiveLang = (lang ?? personal?.preferredLanguage) as
      | 'en'
      | 'fr'
      | 'rw'
      | undefined;

    // Filter the feed by originalLanguage so users only see news actually written
    // in their chosen language. Without this, titles (which we don't translate)
    // would mix English / French / Kinyarwanda content on the same feed.
    const where: Prisma.ArticleWhereInput = {};
    const andFilters: Prisma.ArticleWhereInput[] = [];

    if (effectiveLang) {
      andFilters.push({ originalLanguage: effectiveLang });
    }

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

    // Category filter only when the client explicitly requests it (e.g. Explore tab).
    // Do not hard-filter by saved favoriteTopics here: logged-in users would see far
    // fewer articles than guests (especially for rw, where the catalog is smaller).
    // Topic preferences are applied on the client for section ordering ("For you").
    if (category) {
      const normalizedCategory = normalizeCategoryInput(category);
      if (normalizedCategory) {
        andFilters.push({
          category: { equals: normalizedCategory, mode: 'insensitive' },
        });
      } else {
        andFilters.push({
          category: { equals: category, mode: 'insensitive' },
        });
      }
    }
    if (country) {
      andFilters.push({ country: { equals: country, mode: 'insensitive' } });
    }
    if (continent) {
      andFilters.push({
        continent: { equals: continent, mode: 'insensitive' },
      });
    }
    if (region) {
      andFilters.push({ region: { equals: region, mode: 'insensitive' } });
    }
    if (source) {
      andFilters.push({ source: { equals: source, mode: 'insensitive' } });
    }

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
        effectiveLang,
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

  async findOne(
    id: string,
    lang?: 'en' | 'fr' | 'rw',
  ): Promise<ArticleResponseDto> {
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
      lang,
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

  /**
   * One-shot synchronous re-summarize for the admin "Resummarize this article"
   * button. Stays direct because it's a single article, not 200.
   */
  async summarizeOne(
    id: string,
    lang?: 'en' | 'fr' | 'rw',
  ): Promise<ArticleResponseDto> {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException(`Article ${id} not found`);

    const targetLang =
      lang ?? (article.originalLanguage as SupportedLang) ?? 'en';
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
      `Re-summarized ${id} [${targetLang}] via ${result.provider}`,
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
      targetLang,
    );
  }

  /**
   * Ingestion pipeline.
   *
   * Stages 1-4 are SYNCHRONOUS (fast, no AI):
   *   1. Fetch RSS + scraped feeds (parallel)
   *   2. Deduplicate
   *   3. Categorize
   *   4. Persist Article rows with NULL summary
   *
   * Stage 5 is QUEUED (slow, AI-bound):
   *   5. Enqueue 1 BullMQ job per article. The worker calls Groq → Gemini
   *      → fallback through the AiOrchestratorService and writes the result
   *      back to the article row.
   *
   * This keeps the HTTP round-trip predictable (no waiting on rate-limited
   * LLMs) and lets the queue absorb backpressure.
   */
  async ingest(): Promise<IngestResult> {
    const startedAt = Date.now();
    resetImageIngestMetrics();
    this.logger.log('Ingestion pipeline started');

    const [rssResult, scraperResult] = await Promise.allSettled([
      this.rssService.fetchAllFeeds(),
      this.scraperService.scrapeAll(),
    ]);

    const rssArticles: NormalizedArticle[] =
      rssResult.status === 'fulfilled'
        ? rssResult.value
        : (this.logger.error(`RSS fetch failed: ${rssResult.reason}`), []);

    const scrapedArticles: NormalizedArticle[] =
      scraperResult.status === 'fulfilled'
        ? scraperResult.value
        : (this.logger.error(`Scraper failed: ${scraperResult.reason}`), []);

    this.logger.log(
      `Fetched: ${rssArticles.length} RSS + ${scrapedArticles.length} scraped`,
    );

    const rawArticles = [...rssArticles, ...scrapedArticles];
    if (rawArticles.length === 0) return this.emptyResult(startedAt);

    let uniqueArticles: NormalizedArticle[] = rawArticles;
    try {
      uniqueArticles = await this.deduplication.filterDuplicates(rawArticles);
      this.logger.log(
        `Deduplicated: ${uniqueArticles.length} unique (${rawArticles.length - uniqueArticles.length} duplicates dropped)`,
      );
    } catch (err) {
      this.logger.error(
        `Deduplication failed: ${(err as Error).message} — proceeding with raw articles`,
      );
    }

    if (uniqueArticles.length === 0) return this.emptyResult(startedAt);

    const articlesWithCategory = uniqueArticles.map((a) => ({
      ...a,
      ...inferLocationFromText(
        a.title,
        a.content,
        {
          continent: a.continent,
          region: a.region,
          country: a.country,
        },
        this.toSupportedLang(a.originalLanguage),
      ),
      category: this.safeCategorize(
        a.title,
        a.content,
        this.toSupportedLang(a.originalLanguage),
      ),
    }));

    // ── Persist (no AI yet) ───────────────────────────────────────────────
    const insertDataRaw = articlesWithCategory
      .map((article) => {
        // Safety guard requested for production: never save broken scraper output.
        if (!this.isValidArticleForInsert(article)) return null;

        const cleanUrl = article.url.trim();
        if (!cleanUrl) return null;
        const sanitizedContent = sanitizeContentForAI(article.content);
        return {
          title: normalizeText(article.title).substring(0, 1000),
          content: sanitizedContent || normalizeText(article.title),
          summary: null,
          summaryFr: null,
          summaryRw: null,
          originalLanguage: article.originalLanguage,
          source: article.source,
          url: cleanUrl,
          imageUrl: sanitizeImageUrl(article.imageUrl),
          category: article.category,
          continent: article.continent,
          region: article.region,
          country: article.country,
          publishedAt: article.publishedAt,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
    const insertData = dropOverusedImages(insertDataRaw);

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
        `createMany failed: ${(err as Error).message} — falling back to per-row upserts`,
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
            `Failed to save "${record.title.slice(0, 50)}": ${(innerErr as Error).message}`,
          );
          failed++;
        }
      }
    }

    // ── Enqueue summarization for articles still missing the original-lang
    //    summary. We re-query by URL set so we only enqueue for rows that
    //    actually exist (handles `skipDuplicates` correctly).
    const urls = insertData.map((r) => r.url);
    const persisted = await this.prisma.article.findMany({
      where: { url: { in: urls } },
      select: {
        id: true,
        title: true,
        content: true,
        url: true,
        originalLanguage: true,
        summary: true,
        summaryFr: true,
        summaryRw: true,
      },
    });

    const jobs: SummarizeArticleJobData[] = [];
    for (const a of persisted) {
      const lang = this.toSupportedLang(a.originalLanguage);
      const field =
        lang === 'fr' ? 'summaryFr' : lang === 'rw' ? 'summaryRw' : 'summary';
      const current =
        field === 'summary'
          ? a.summary
          : field === 'summaryFr'
            ? a.summaryFr
            : a.summaryRw;
      if (current) continue; // already summarized — don't re-spend tokens
      jobs.push({
        articleId: a.id,
        title: a.title,
        content: a.content,
        url: a.url,
        language: lang,
        field,
      });
    }

    const enqueued = await this.summarizationQueue.enqueueBatch(jobs);

    await this.invalidateListCache();

    const durationMs = Date.now() - startedAt;
    this.logger.log(
      `Ingestion done in ${durationMs}ms — saved=${saved}, enqueued=${enqueued}, dbErrors=${failed}`,
    );
    this.logger.log(formatImageIngestMetricsSummary(uniqueArticles.length));

    return {
      processed: uniqueArticles.length,
      saved,
      enqueued,
      failed,
      durationMs,
    };
  }

  /** Backfill EN summaries via the queue (non-blocking). */
  async resummarizeUnsummarized(): Promise<BackfillResult> {
    const missing = await this.prisma.article.findMany({
      where: { summary: null, originalLanguage: 'en' },
      select: { id: true, title: true, content: true, url: true },
    });

    const jobs: SummarizeArticleJobData[] = missing.map((a) => ({
      articleId: a.id,
      title: a.title,
      content: a.content,
      url: a.url,
      language: 'en',
      field: 'summary',
    }));

    const enqueued = await this.summarizationQueue.enqueueBatch(jobs);
    this.logger.log(
      `Resummarize: enqueued ${enqueued}/${missing.length} EN articles`,
    );
    return { total: missing.length, enqueued };
  }

  /** Backfill French summaries via the queue. */
  async backfillFrench(): Promise<BackfillResult> {
    const missing = await this.prisma.article.findMany({
      where: { summaryFr: null },
      select: { id: true, title: true, content: true, url: true },
    });

    const jobs: SummarizeArticleJobData[] = missing.map((a) => ({
      articleId: a.id,
      title: a.title,
      content: a.content,
      url: a.url,
      language: 'fr',
      field: 'summaryFr',
    }));

    const enqueued = await this.summarizationQueue.enqueueBatch(jobs);
    this.logger.log(
      `French backfill: enqueued ${enqueued}/${missing.length} articles`,
    );
    return { total: missing.length, enqueued };
  }

  /** Backfill Kinyarwanda summaries via the queue. */
  async backfillKinyarwanda(): Promise<BackfillResult> {
    const missing = await this.prisma.article.findMany({
      where: { summaryRw: null, originalLanguage: 'rw' },
      select: { id: true, title: true, content: true, url: true },
    });

    const jobs: SummarizeArticleJobData[] = missing.map((a) => ({
      articleId: a.id,
      title: a.title,
      content: a.content,
      url: a.url,
      language: 'rw',
      field: 'summaryRw',
    }));

    const enqueued = await this.summarizationQueue.enqueueBatch(jobs);
    this.logger.log(
      `RW backfill: enqueued ${enqueued}/${missing.length} articles`,
    );
    return { total: missing.length, enqueued };
  }

  /**
   * Recompute categories for existing rows using the current categorizer.
   * Useful after taxonomy/keyword improvements.
   */
  async recategorizeAll(limit = 5000): Promise<RecategorizeResult> {
    const rows = await this.prisma.article.findMany({
      take: Math.min(Math.max(limit, 1), 20000),
      select: {
        id: true,
        title: true,
        content: true,
        originalLanguage: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let updated = 0;
    for (const row of rows) {
      const recomputed = this.safeCategorize(
        row.title,
        row.content,
        this.toSupportedLang(row.originalLanguage),
      );
      if ((row.category ?? 'General') === recomputed) continue;
      await this.prisma.article.update({
        where: { id: row.id },
        data: { category: recomputed },
      });
      updated++;
    }

    await this.invalidateListCache();
    this.logger.log(
      `Recategorize complete: scanned=${rows.length}, updated=${updated}`,
    );
    return { scanned: rows.length, updated };
  }

  /**
   * Recompute category + inferred location for existing rows (does not alter stored images).
   */
  async reindexMetadata(limit = 5000): Promise<ReindexMetadataResult> {
    const rows = await this.prisma.article.findMany({
      take: Math.min(Math.max(limit, 1), 20000),
      select: {
        id: true,
        title: true,
        content: true,
        originalLanguage: true,
        category: true,
        continent: true,
        region: true,
        country: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let updated = 0;
    for (const row of rows) {
      const lang = this.toSupportedLang(row.originalLanguage);
      const sanitizedContent = sanitizeContentForAI(row.content);
      const inferred = inferLocationFromText(
        row.title,
        sanitizedContent,
        {
          continent: row.continent ?? 'Global',
          region: row.region ?? 'Global',
          country: row.country ?? 'Global',
        },
        lang,
      );
      const category = this.safeCategorize(row.title, sanitizedContent, lang);

      const changed =
        (row.category ?? 'General') !== category ||
        (row.country ?? null) !== inferred.country ||
        (row.region ?? null) !== inferred.region ||
        (row.continent ?? null) !== inferred.continent;

      if (!changed) continue;

      await this.prisma.article.update({
        where: { id: row.id },
        data: {
          category,
          country: inferred.country,
          region: inferred.region,
          continent: inferred.continent,
        },
      });
      updated++;
    }

    await this.invalidateListCache();
    this.logger.log(
      `Metadata reindex complete: scanned=${rows.length}, updated=${updated}`,
    );
    return { scanned: rows.length, updated };
  }

  /**
   * Optional repair: backfill images only where missing (default), and optionally trim
   * fingerprint-duplicated hero images that appear too often in recent rows.
   */
  async reindexImages(options?: {
    limit?: number;
    fixDuplicateFingerprints?: boolean;
    duplicateFingerprintMinRows?: number;
    duplicateKeepFirst?: number;
    concurrency?: number;
  }): Promise<ReindexImagesResult> {
    const startedAt = Date.now();
    const limit = Math.min(Math.max(options?.limit ?? 400, 1), 8000);
    const concurrency = Math.min(Math.max(options?.concurrency ?? 8, 1), 24);
    const fixDup = options?.fixDuplicateFingerprints ?? false;
    const dupMin = Math.min(
      Math.max(options?.duplicateFingerprintMinRows ?? 12, 4),
      500,
    );
    const keepFirst = Math.min(
      Math.max(options?.duplicateKeepFirst ?? 3, 1),
      20,
    );

    let duplicatesNulled = 0;
    if (fixDup) {
      duplicatesNulled = await this.nullExcessFingerprintDuplicates(
        dupMin,
        keepFirst,
      );
    }

    const missing = await this.prisma.article.findMany({
      where: { imageUrl: null },
      select: { id: true, title: true, url: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    const memoHtml = new Map<string, string | null>();
    let updated = 0;

    for (let i = 0; i < missing.length; i += concurrency) {
      const slice = missing.slice(i, i + concurrency);
      const batchHits = await Promise.all(
        slice.map(async (row) => {
          if (!row.url?.trim()) return false;
          let html = memoHtml.get(row.url);
          if (html === undefined) {
            html = await this.fetchArticleHtmlBrief(row.url);
            memoHtml.set(row.url, html);
          }
          if (!html) return false;

          const extracted = extractBestImageFromArticleHtml(
            html,
            row.url,
            row.title,
          );
          const imageUrl = sanitizeImageUrl(extracted);
          if (!imageUrl) return false;

          await this.prisma.article.update({
            where: { id: row.id },
            data: { imageUrl },
          });
          return true;
        }),
      );
      updated += batchHits.filter(Boolean).length;
    }

    await this.invalidateListCache();
    const durationMs = Date.now() - startedAt;
    this.logger.log(
      `Image reindex: scanned=${missing.length}, updated=${updated}, duplicatesNulled=${duplicatesNulled}, ${durationMs}ms`,
    );

    return {
      scanned: missing.length,
      updated,
      duplicatesNulled,
      durationMs,
    };
  }

  /** Diagnostics for admin/healthcheck — exposes provider + queue state. */
  async getProcessingStatus() {
    const [queue, providers] = await Promise.all([
      this.summarizationQueue.stats(),
      Promise.resolve(this.aiService.getProviderStatus()),
    ]);
    return { queue, providers };
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private applyLanguageView(
    article: ArticleResponseDto,
    lang?: 'en' | 'fr' | 'rw',
  ): ArticleResponseDto {
    if (!lang) return article;

    // Feed is filtered by originalLanguage; pick the best summary for that language
    // with same fallback chain as the mobile app (rw catalog is smaller — avoid
    // empty cards while summaryRw is still queued).
    let requestedSummary: string | null;
    if (lang === 'rw') {
      requestedSummary =
        article.summaryRw ?? article.summary ?? article.summaryFr ?? null;
    } else if (lang === 'fr') {
      requestedSummary =
        article.summaryFr ?? article.summary ?? article.summaryRw ?? null;
    } else {
      requestedSummary =
        article.summary ?? article.summaryFr ?? article.summaryRw ?? null;
    }

    return { ...article, summary: requestedSummary };
  }

  private toSupportedLang(lang: string): SupportedLang {
    if (lang === 'fr' || lang === 'rw') return lang;
    return 'en';
  }

  private isValidArticleForInsert(article: NormalizedArticle): boolean {
    // Keep strict hard validation for RW scraped sources only; RSS sources
    // may be shorter but still valid according to their feed contracts.
    if (!this.isRwScrapedSource(article)) return true;

    if (!isValidArticle(article, { minContentLength: 250 })) return false;

    const sanitized = sanitizeContentForAI(article.content);
    const quality = getContentQualityScore(article.title, sanitized, {
      minContentLength: 250,
    });
    if (!quality.ok) return false;

    return hasRealJournalisticContent(sanitized, article.title);
  }

  private isRwScrapedSource(article: NormalizedArticle): boolean {
    return (
      article.originalLanguage === 'rw' &&
      (article.source === 'Igihe' || article.source === 'Kigali Today')
    );
  }

  private normalizeArticleResponse(
    article: ArticleResponseDto,
    lang?: SupportedLang,
  ): ArticleResponseDto {
    return {
      ...article,
      imageUrl: this.normalizeImageUrl(article.imageUrl),
      category: localizeCategory(article.category, lang),
    };
  }

  private normalizeImageUrl(url: string | null | undefined): string | null {
    return sanitizeImageUrl(url);
  }

  private async fetchArticleHtmlBrief(url: string): Promise<string | null> {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 12_000);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'NewsAggregator/1.0 (+https://newssummary.app)',
          Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        },
      });
      clearTimeout(tid);
      if (!res.ok) return null;
      const ct = res.headers.get('content-type') ?? '';
      if (!ct.includes('text/html') && !ct.includes('application/xhtml'))
        return null;
      const text = await res.text();
      return text.length > 400 ? text : null;
    } catch {
      clearTimeout(tid);
      return null;
    }
  }

  /**
   * Clears imageUrl for newer rows when the same canonical fingerprint appears
   * too often among recently published articles (optional repair).
   */
  private async nullExcessFingerprintDuplicates(
    minRows: number,
    keepFirst: number,
  ): Promise<number> {
    const rows = await this.prisma.article.findMany({
      where: { imageUrl: { not: null } },
      select: { id: true, imageUrl: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
      take: 12000,
    });

    const byFp = new Map<string, typeof rows>();
    for (const r of rows) {
      const fp = fingerprintCanonicalImageUrl(r.imageUrl!);
      const list = byFp.get(fp) ?? [];
      list.push(r);
      byFp.set(fp, list);
    }

    let nulled = 0;
    for (const [, list] of byFp) {
      if (list.length < minRows) continue;
      const sorted = [...list].sort(
        (a, b) => a.publishedAt.getTime() - b.publishedAt.getTime(),
      );
      for (const row of sorted.slice(keepFirst)) {
        await this.prisma.article.update({
          where: { id: row.id },
          data: { imageUrl: null },
        });
        nulled++;
      }
    }
    return nulled;
  }

  private emptyResult(startedAt: number): IngestResult {
    return {
      processed: 0,
      saved: 0,
      enqueued: 0,
      failed: 0,
      durationMs: Date.now() - startedAt,
    };
  }

  private safeCategorize(
    title: string,
    content: string,
    language: SupportedLang,
  ): CanonicalCategory {
    try {
      return this.categorizer.categorize(title, content, language);
    } catch (err) {
      this.logger.warn(
        `Categorization failed for "${title.slice(0, 40)}": ${(err as Error).message}`,
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
