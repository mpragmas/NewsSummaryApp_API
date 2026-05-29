import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma';
import { UsersService } from '../users/users.service';
import { ClusteringQueueService } from '../queue/clustering.queue';
import { StoryClusteringService } from '../articles/clustering/story-clustering.service';
import { ArticleResponseDto } from '../articles/dto/article-response.dto';
import { toArticleView } from '../articles/article-view.util';
import { localizeCategory } from '../articles/category-i18n.util';
import { sanitizeImageUrl } from '../common/util/image-quality.util';
import {
  PaginatedStoriesDto,
  StoryDetailDto,
  StoryListItemDto,
  StorySourcePreviewDto,
} from './dto/story-response.dto';
import { QueryStoriesDto } from './dto/query-stories.dto';

const CACHE_PREFIX = 'stories';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

type Lang = 'en' | 'fr' | 'rw';

@Injectable()
export class StoriesService {
  private readonly logger = new Logger(StoriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly clusteringQueue: ClusteringQueueService,
    private readonly clusteringService: StoryClusteringService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(
    query: QueryStoriesDto,
    userId?: string,
  ): Promise<PaginatedStoriesDto> {
    const cacheKey = `${CACHE_PREFIX}:list:${JSON.stringify({ ...query, _u: userId ?? null })}`;
    const cached = await this.cacheGet<PaginatedStoriesDto>(cacheKey);
    if (cached) return cached;

    const personal = userId
      ? await this.usersService.getPersonalizationForFeed(userId)
      : null;

    const {
      page = 1,
      limit = 20,
      lang,
      query: searchText,
      category,
      country,
      continent,
      region,
    } = query;
    const skip = (page - 1) * limit;
    const effectiveLang = (lang ?? personal?.preferredLanguage) as
      | Lang
      | undefined;

    const andFilters: Prisma.StoryClusterWhereInput[] = [
      { articleCount: { gt: 0 } },
    ];
    if (effectiveLang) andFilters.push({ language: effectiveLang });

    const q = searchText?.trim();
    if (q) {
      andFilters.push({
        OR: [
          { canonicalTitle: { contains: q, mode: 'insensitive' } },
          { canonicalSummary: { contains: q, mode: 'insensitive' } },
          {
            articles: {
              some: {
                OR: [
                  { title: { contains: q, mode: 'insensitive' } },
                  { summary: { contains: q, mode: 'insensitive' } },
                  { summaryFr: { contains: q, mode: 'insensitive' } },
                  { summaryRw: { contains: q, mode: 'insensitive' } },
                ],
              },
            },
          },
        ],
      });
    }
    if (category) {
      andFilters.push({ category: { equals: category, mode: 'insensitive' } });
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

    const where: Prisma.StoryClusterWhereInput = { AND: andFilters };

    const [clusters, total] = await Promise.all([
      this.prisma.storyCluster.findMany({
        where,
        orderBy: { latestPublishedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.storyCluster.count({ where }),
    ]);

    const sourcesByCluster = await this.loadSourcePreviews(
      clusters.map((c) => c.id),
    );

    const data: StoryListItemDto[] = clusters.map((c) =>
      this.toListItem(c, sourcesByCluster.get(c.id) ?? [], effectiveLang),
    );

    const result: PaginatedStoriesDto = {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

    await this.cacheSet(cacheKey, result);
    return result;
  }

  async findOne(
    id: string,
    lang?: Lang,
    userId?: string,
  ): Promise<StoryDetailDto> {
    const effectiveLang =
      lang ??
      (userId
        ? (await this.usersService.getPersonalizationForFeed(userId))
            ?.preferredLanguage
        : undefined);

    const cacheKey = `${CACHE_PREFIX}:one:${id}:${effectiveLang ?? 'default'}`;
    const cached = await this.cacheGet<StoryDetailDto>(cacheKey);
    if (cached) return cached;

    const cluster = await this.prisma.storyCluster.findUnique({
      where: { id },
    });
    if (!cluster) throw new NotFoundException(`Story ${id} not found`);

    const members = await this.prisma.article.findMany({
      where: { clusterId: id },
      orderBy: { publishedAt: 'desc' },
    });

    const articles: ArticleResponseDto[] = members.map((m) =>
      toArticleView(m as ArticleResponseDto, effectiveLang),
    );

    const previews: StorySourcePreviewDto[] = this.dedupeSources(
      members.map((m) => ({ articleId: m.id, source: m.source })),
    );

    const result: StoryDetailDto = {
      ...this.toListItem(cluster, previews, effectiveLang),
      articles,
    };

    await this.cacheSet(cacheKey, result);
    return result;
  }

  /** Lighter source list (one mapped article per source contribution). */
  async findSources(id: string, lang?: Lang): Promise<ArticleResponseDto[]> {
    const cluster = await this.prisma.storyCluster.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!cluster) throw new NotFoundException(`Story ${id} not found`);

    const members = await this.prisma.article.findMany({
      where: { clusterId: id },
      orderBy: { publishedAt: 'desc' },
    });
    return members.map((m) => toArticleView(m as ArticleResponseDto, lang));
  }

  /** Run a clustering pass synchronously (admin/manual) and also enqueue for background follow-up. */
  async recluster(rebuild = false): Promise<{ enqueued: boolean; result: unknown }> {
    const result = rebuild
      ? await this.clusteringService.rebuildAll()
      : await this.clusteringService.clusterUnassigned();

    // Also enqueue so any articles that arrive while this run was processing get picked up.
    try {
      await this.clusteringQueue.enqueueClusterRecent({ trigger: 'manual', rebuild: false });
    } catch {
      // Non-fatal: queue may be unavailable (no Redis), sync run already completed above.
    }

    return { enqueued: true, result };
  }

  // ─── helpers ───────────────────────────────────────────────────────────

  private async loadSourcePreviews(
    clusterIds: string[],
  ): Promise<Map<string, StorySourcePreviewDto[]>> {
    const map = new Map<string, StorySourcePreviewDto[]>();
    if (clusterIds.length === 0) return map;

    const rows = await this.prisma.article.findMany({
      where: { clusterId: { in: clusterIds } },
      select: { id: true, source: true, clusterId: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
    });

    const grouped = new Map<string, { articleId: string; source: string }[]>();
    for (const r of rows) {
      if (!r.clusterId) continue;
      const list = grouped.get(r.clusterId) ?? [];
      list.push({ articleId: r.id, source: r.source });
      grouped.set(r.clusterId, list);
    }
    for (const [cid, list] of grouped) {
      map.set(cid, this.dedupeSources(list));
    }
    return map;
  }

  /** One preview entry per distinct source (keeps the most recent article). */
  private dedupeSources(
    list: { articleId: string; source: string }[],
  ): StorySourcePreviewDto[] {
    const seen = new Set<string>();
    const out: StorySourcePreviewDto[] = [];
    for (const item of list) {
      const key = item.source.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ articleId: item.articleId, source: item.source });
    }
    return out;
  }

  private toListItem(
    c: {
      id: string;
      canonicalTitle: string;
      canonicalSummary: string | null;
      imageUrl: string | null;
      category: string | null;
      continent: string | null;
      region: string | null;
      country: string | null;
      language: string;
      sourceCount: number;
      articleCount: number;
      languages: string[];
      leadArticleId: string | null;
      latestPublishedAt: Date;
      createdAt: Date;
    },
    sources: StorySourcePreviewDto[],
    lang?: Lang,
  ): StoryListItemDto {
    return {
      id: c.id,
      canonicalTitle: c.canonicalTitle,
      canonicalSummary: c.canonicalSummary,
      imageUrl: sanitizeImageUrl(c.imageUrl),
      category: localizeCategory(c.category, lang),
      continent: c.continent,
      region: c.region,
      country: c.country,
      language: c.language,
      sourceCount: c.sourceCount,
      articleCount: c.articleCount,
      languages: c.languages,
      leadArticleId: c.leadArticleId,
      sources,
      latestPublishedAt: c.latestPublishedAt,
      createdAt: c.createdAt,
    };
  }

  private async cacheGet<T>(key: string): Promise<T | null> {
    try {
      return (await this.cacheManager.get<T>(key)) ?? null;
    } catch (err) {
      this.logger.warn(`Cache read failed: ${(err as Error).message}`);
      return null;
    }
  }

  private async cacheSet<T>(key: string, value: T): Promise<void> {
    try {
      await this.cacheManager.set(key, value, CACHE_TTL);
    } catch (err) {
      this.logger.warn(`Cache write failed: ${(err as Error).message}`);
    }
  }
}
