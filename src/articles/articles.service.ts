import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { RssService } from '../rss/rss.service';
import { AiService } from '../ai/ai.service';
import { CategorizerService } from './categorizer.service';
import { DeduplicationService } from './deduplication.service';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { PaginatedArticlesDto, ArticleResponseDto } from './dto/article-response.dto';

const CACHE_PREFIX = 'articles';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in ms

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
    const cached = await this.cacheManager.get<PaginatedArticlesDto>(cacheKey);
    if (cached) return cached;

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

    await this.cacheManager.set(cacheKey, result, CACHE_TTL);
    return result;
  }

  async findOne(id: string): Promise<ArticleResponseDto> {
    const cacheKey = `${CACHE_PREFIX}:${id}`;
    const cached = await this.cacheManager.get<ArticleResponseDto>(cacheKey);
    if (cached) return cached;

    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException(`Article ${id} not found`);

    await this.cacheManager.set(cacheKey, article, CACHE_TTL);
    return article as ArticleResponseDto;
  }

  async ingest(): Promise<{ processed: number; saved: number }> {
    this.logger.log('Starting ingestion pipeline...');

    const rawArticles = await this.rssService.fetchAllFeeds();
    const uniqueArticles = await this.deduplication.filterDuplicates(rawArticles);

    if (uniqueArticles.length === 0) {
      this.logger.log('No new articles to process');
      return { processed: 0, saved: 0 };
    }

    this.logger.log(`Processing ${uniqueArticles.length} new articles...`);

    // Categorize all articles
    const articlesWithCategory = uniqueArticles.map((a) => ({
      ...a,
      category: this.categorizer.categorize(a.title, a.content),
    }));

    // Summarize in batches
    const summaries = await this.aiService.summarizeBatch(
      articlesWithCategory.map((a) => ({
        title: a.title,
        content: a.content,
        url: a.url,
      })),
    );

    // Persist to DB
    let saved = 0;
    const insertData = articlesWithCategory.map((article, idx) => ({
      title: article.title,
      content: article.content,
      summary: summaries[idx] || null,
      source: article.source,
      url: article.url,
      category: article.category,
      continent: article.continent,
      region: article.region,
      country: article.country,
      publishedAt: article.publishedAt,
    }));

    // Use createMany with skipDuplicates for atomicity
    const result = await this.prisma.article.createMany({
      data: insertData,
      skipDuplicates: true,
    });
    saved = result.count;

    // Invalidate list caches
    await this.invalidateListCache();

    this.logger.log(`Ingestion complete: ${saved} articles saved`);
    return { processed: uniqueArticles.length, saved };
  }

  private async invalidateListCache(): Promise<void> {
    try {
      // Cache manager doesn't support pattern deletion natively; reset with a known key
      await this.cacheManager.reset();
    } catch (error) {
      this.logger.warn(`Cache invalidation failed: ${(error as Error).message}`);
    }
  }
}
