import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { RssService, NormalizedArticle } from '../rss/rss.service';
import { AiService } from '../ai/ai.service';
import { fallbackSummary } from '../ai/fallback-summary.util';
import { CategorizerService } from './categorizer.service';
import { DeduplicationService } from './deduplication.service';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { PaginatedArticlesDto, ArticleResponseDto } from './dto/article-response.dto';

const CACHE_PREFIX = 'articles';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export interface IngestResult {
  processed: number;
  saved: number;
  summarized: number; // always equals processed (AI or fallback)
  aiSummarized: number; // Groq or Gemini
  fallbackUsed: number; // local deterministic fallback
  failed: number; // DB write failures
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
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(query: QueryArticlesDto): Promise<PaginatedArticlesDto> {
    const cacheKey = `${CACHE_PREFIX}:${JSON.stringify(query)}`;

    try {
      const cached = await this.cacheManager.get<PaginatedArticlesDto>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      this.logger.warn(`Cache read failed (continuing without cache): ${(err as Error).message}`);
    }

    const { page = 1, limit = 20, sortBy = 'publishedAt', order = 'desc', ...filters } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filters.category) where.category = filters.category;
    if (filters.country) where.country = filters.country;
    if (filters.continent) where.continent = filters.continent;
    if (filters.source) where.source = filters.source;

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      this.prisma.article.count({ where }),
    ]);

    const result: PaginatedArticlesDto = {
      data: articles as ArticleResponseDto[],
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
      this.logger.warn(`Cache write failed (non-fatal): ${(err as Error).message}`);
    }

    return result;
  }

  async findOne(id: string): Promise<ArticleResponseDto> {
    const cacheKey = `${CACHE_PREFIX}:${id}`;

    try {
      const cached = await this.cacheManager.get<ArticleResponseDto>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      this.logger.warn(`Cache read failed (continuing without cache): ${(err as Error).message}`);
    }

    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException(`Article ${id} not found`);

    try {
      await this.cacheManager.set(cacheKey, article, CACHE_TTL);
    } catch (err) {
      this.logger.warn(`Cache write failed (non-fatal): ${(err as Error).message}`);
    }

    return article as ArticleResponseDto;
  }

  async summarizeOne(id: string): Promise<ArticleResponseDto> {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException(`Article ${id} not found`);

    // summarizeArticle ALWAYS returns a non-empty summary (AI or fallback)
    const result = await this.aiService.summarizeArticle(
      article.title,
      article.content,
      article.url,
    );

    const updated = await this.prisma.article.update({
      where: { id },
      data: { summary: result.text },
    });

    this.logger.log(`🔁 Re-summarized ${id} via ${result.provider}`);

    try {
      await this.cacheManager.del(`${CACHE_PREFIX}:${id}`);
    } catch (err) {
      this.logger.warn(`Cache invalidation failed (non-fatal): ${(err as Error).message}`);
    }

    return updated as ArticleResponseDto;
  }

  /**
   * Full ingestion pipeline. Never throws — external failures (RSS, AI, Redis)
   * are logged and recovered from. Every persisted article is guaranteed to
   * have a non-empty summary (AI-generated or local deterministic fallback).
   */
  async ingest(): Promise<IngestResult> {
    const startedAt = Date.now();
    this.logger.log('🔄 Ingestion pipeline started');

    // ── 1. Fetch (RSS failures never stop the pipeline) ───────────────────
    let rawArticles: NormalizedArticle[] = [];
    try {
      rawArticles = await this.rssService.fetchAllFeeds();
      this.logger.log(`📥 Fetched ${rawArticles.length} raw articles from RSS feeds`);
    } catch (err) {
      this.logger.error(
        `❌ RSS fetch failed catastrophically: ${(err as Error).message} — continuing with 0 articles`,
      );
    }

    if (rawArticles.length === 0) {
      this.logger.warn('⚠️  No articles fetched — pipeline complete with 0 results');
      return this.emptyResult(startedAt);
    }

    // ── 2. Deduplicate ────────────────────────────────────────────────────
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
      this.logger.log('✅ No new articles to process (all duplicates) — pipeline complete');
      return this.emptyResult(startedAt);
    }

    // ── 3. Categorize ─────────────────────────────────────────────────────
    const articlesWithCategory = uniqueArticles.map((a) => ({
      ...a,
      category: this.safeCategorize(a.title, a.content),
    }));
    this.logger.log(`🏷️  Categorized ${articlesWithCategory.length} articles`);

    // ── 4. Summarize (always succeeds — local fallback guarantees this) ───
    this.logger.log(`🤖 Requesting summaries for ${articlesWithCategory.length} articles…`);
    const summaries = await this.aiService.summarizeBatch(
      articlesWithCategory.map((a) => ({
        title: a.title,
        content: a.content,
        url: a.url,
      })),
    );

    // Belt-and-braces: if anything somehow returned empty, force local fallback
    const guaranteedSummaries = summaries.map((s, idx) => {
      const article = articlesWithCategory[idx];
      if (!s?.text || s.text.trim().length === 0) {
        this.logger.warn(
          `⚠️  Empty summary slipped through for "${article.title.substring(0, 50)}" — forcing local fallback`,
        );
        return {
          text: fallbackSummary(article.content, article.title, article.url),
          provider: 'fallback' as const,
        };
      }
      return s;
    });

    const aiSummarized = guaranteedSummaries.filter(
      (s) => s.provider === 'groq' || s.provider === 'gemini',
    ).length;
    const fallbackUsed = guaranteedSummaries.filter((s) => s.provider === 'fallback').length;
    const summarized = guaranteedSummaries.length; // guaranteed non-empty

    if (fallbackUsed > 0) {
      this.logger.warn(
        `⚠️  ${fallbackUsed}/${summarized} articles used local fallback — AI providers degraded`,
      );
    }

    // ── 5. Persist ────────────────────────────────────────────────────────
    const insertData = articlesWithCategory.map((article, idx) => ({
      title: article.title,
      content: article.content,
      summary: guaranteedSummaries[idx].text,
      source: article.source,
      url: article.url,
      category: article.category,
      continent: article.continent,
      region: article.region,
      country: article.country,
      publishedAt: article.publishedAt,
    }));

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

    // ── 6. Cache invalidation (non-fatal) ─────────────────────────────────
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
   * Backfill summaries for articles still stored with a null summary from the
   * pre-fallback era. Guaranteed to always produce a non-empty summary.
   */
  async resummarizeUnsummarized(): Promise<{
    total: number;
    summarized: number;
    aiSummarized: number;
    fallbackUsed: number;
    errors: number;
  }> {
    const unsummarized = await this.prisma.article.findMany({
      where: { summary: null },
      select: { id: true, title: true, content: true, url: true },
    });

    if (unsummarized.length === 0) {
      this.logger.log('All articles already have summaries');
      return { total: 0, summarized: 0, aiSummarized: 0, fallbackUsed: 0, errors: 0 };
    }

    this.logger.log(`Found ${unsummarized.length} articles without summaries — backfilling…`);

    const summaries = await this.aiService.summarizeBatch(
      unsummarized.map((a) => ({ title: a.title, content: a.content, url: a.url })),
    );

    let summarized = 0;
    let aiSummarized = 0;
    let fallbackUsed = 0;
    let errors = 0;

    for (let i = 0; i < unsummarized.length; i++) {
      const article = unsummarized[i];
      const result = summaries[i] ?? {
        text: fallbackSummary(article.content, article.title, article.url),
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
      `Re-summarization complete: ${summarized} summarized (AI: ${aiSummarized}, fallback: ${fallbackUsed}), ${errors} db errors`,
    );

    return { total: unsummarized.length, summarized, aiSummarized, fallbackUsed, errors };
  }

  // ─── Private helpers ────────────────────────────────────────────────────

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
      this.logger.warn(`Categorization failed for "${title.substring(0, 40)}": ${(err as Error).message}`);
      return 'General';
    }
  }

  private async invalidateListCache(): Promise<void> {
    try {
      // cache-manager v7 uses .clear() to flush all entries
      await (this.cacheManager as Cache & { clear: () => Promise<void> }).clear();
    } catch (error) {
      this.logger.warn(`Cache invalidation failed (non-fatal): ${(error as Error).message}`);
    }
  }
}
