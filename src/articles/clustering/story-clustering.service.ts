import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';
import {
  isLikelyGenericAsset,
  sanitizeImageUrl,
} from '../../common/util/image-quality.util';
import { fingerprintCanonicalImageUrl } from '../../common/util/image-extractor.util';
import {
  ArticleSignature,
  ClusterTarget,
  SIMILARITY_THRESHOLD,
  TIME_WINDOW_HOURS,
  extractEntityKeys,
  normalizeTitleTokens,
  scoreSimilarity,
} from './text-signature.util';

/** Minimal article shape needed for clustering. */
interface ClusterableArticle {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  summaryFr: string | null;
  summaryRw: string | null;
  imageUrl: string | null;
  source: string;
  originalLanguage: string;
  category: string | null;
  continent: string | null;
  region: string | null;
  country: string | null;
  publishedAt: Date;
}

export interface ClusterRunResult {
  scanned: number;
  attached: number;
  created: number;
  durationMs: number;
}

const ARTICLE_SELECT = {
  id: true,
  title: true,
  content: true,
  summary: true,
  summaryFr: true,
  summaryRw: true,
  imageUrl: true,
  source: true,
  originalLanguage: true,
  category: true,
  continent: true,
  region: true,
  country: true,
  publishedAt: true,
} as const;

/** Process at most this many unassigned articles per run (keeps runs bounded). */
const MAX_PER_RUN = 2_000;
/** Candidate clusters pulled per article — bounds in-memory scoring (no O(n²)). */
const CANDIDATE_LIMIT = 50;

@Injectable()
export class StoryClusteringService {
  private readonly logger = new Logger(StoryClusteringService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Incrementally cluster every article with `clusterId = null`.
   *
   * Articles are processed oldest-first so the earliest member seeds the
   * cluster. Processing is sequential (the worker runs at concurrency 1) so two
   * articles of the same event never race to create duplicate clusters.
   */
  async clusterUnassigned(): Promise<ClusterRunResult> {
    const startedAt = Date.now();

    const pending = (await this.prisma.article.findMany({
      where: { clusterId: null },
      select: ARTICLE_SELECT,
      orderBy: { publishedAt: 'asc' },
      take: MAX_PER_RUN,
    })) as ClusterableArticle[];

    let attached = 0;
    let created = 0;

    for (const article of pending) {
      try {
        const result = await this.assignArticle(article);
        if (result === 'attached') attached++;
        else created++;
      } catch (err) {
        this.logger.warn(
          `Clustering failed for "${article.title.slice(0, 50)}": ${(err as Error).message}`,
        );
      }
    }

    const durationMs = Date.now() - startedAt;
    this.logger.log(
      `Clustering run: scanned=${pending.length}, attached=${attached}, created=${created}, ${durationMs}ms`,
    );
    return { scanned: pending.length, attached, created, durationMs };
  }

  /** Wipe all cluster assignments and clusters, then re-cluster from scratch. */
  async rebuildAll(): Promise<ClusterRunResult> {
    await this.prisma.article.updateMany({ data: { clusterId: null } });
    await this.prisma.storyCluster.deleteMany({});
    this.logger.warn('Story clusters wiped — rebuilding from scratch');
    return this.clusterUnassigned();
  }

  // ─── internals ───────────────────────────────────────────────────────────

  private buildSignature(article: ClusterableArticle): ArticleSignature {
    return {
      titleTokens: normalizeTitleTokens(
        article.title,
        article.originalLanguage,
      ),
      entityKeys: extractEntityKeys(article.title, article.content),
      category: article.category,
      region: article.region,
      country: article.country,
      publishedAt: article.publishedAt,
      language: article.originalLanguage,
    };
  }

  private async assignArticle(
    article: ClusterableArticle,
  ): Promise<'attached' | 'created'> {
    const sig = this.buildSignature(article);

    const best = sig.entityKeys.length
      ? await this.findBestCluster(article, sig)
      : null;

    if (best) {
      await this.prisma.article.update({
        where: { id: article.id },
        data: { clusterId: best.id },
      });
      await this.recomputeCluster(best.id);
      return 'attached';
    }

    await this.createClusterFor(article, sig);
    return 'created';
  }

  private async findBestCluster(
    article: ClusterableArticle,
    sig: ArticleSignature,
  ): Promise<{ id: string } | null> {
    const since = new Date(Date.now() - TIME_WINDOW_HOURS * 3_600_000);

    // Bounded candidate retrieval: same language, recent, entity-overlapping
    // (GIN index on entityKeys). Category/region narrow further when present.
    const where: Prisma.StoryClusterWhereInput = {
      language: this.toLang(article.originalLanguage),
      latestPublishedAt: { gte: since },
      entityKeys: { hasSome: sig.entityKeys },
    };
    if (article.category) where.category = article.category;

    const candidates = await this.prisma.storyCluster.findMany({
      where,
      select: {
        id: true,
        titleTokens: true,
        entityKeys: true,
        category: true,
        region: true,
        country: true,
        latestPublishedAt: true,
        language: true,
      },
      orderBy: { latestPublishedAt: 'desc' },
      take: CANDIDATE_LIMIT,
    });

    let best: { id: string; score: number } | null = null;
    for (const c of candidates) {
      const target: ClusterTarget = {
        titleTokens: c.titleTokens,
        entityKeys: c.entityKeys,
        category: c.category,
        region: c.region,
        country: c.country,
        latestPublishedAt: c.latestPublishedAt,
        language: c.language,
      };
      const score = scoreSimilarity(sig, target);
      if (score >= SIMILARITY_THRESHOLD && (!best || score > best.score)) {
        best = { id: c.id, score };
      }
    }
    return best ? { id: best.id } : null;
  }

  private async createClusterFor(
    article: ClusterableArticle,
    sig: ArticleSignature,
  ): Promise<void> {
    const cluster = await this.prisma.storyCluster.create({
      data: {
        canonicalTitle: article.title,
        canonicalSummary: this.pickSummary(article),
        imageUrl: this.isUsableImage(article.imageUrl)
          ? article.imageUrl
          : null,
        category: article.category,
        continent: article.continent,
        region: article.region,
        country: article.country,
        language: this.toLang(article.originalLanguage),
        entityKeys: sig.entityKeys,
        titleTokens: sig.titleTokens,
        sourceCount: 1,
        articleCount: 1,
        languages: [this.toLang(article.originalLanguage)],
        leadArticleId: article.id,
        latestPublishedAt: article.publishedAt,
      },
    });

    await this.prisma.article.update({
      where: { id: article.id },
      data: { clusterId: cluster.id },
    });
  }

  /**
   * Recompute denormalized cluster aggregates from its member articles:
   * counts, languages, canonical fields, merged signatures and best image.
   */
  private async recomputeCluster(clusterId: string): Promise<void> {
    const members = (await this.prisma.article.findMany({
      where: { clusterId },
      select: ARTICLE_SELECT,
      orderBy: { publishedAt: 'desc' },
    })) as ClusterableArticle[];

    if (members.length === 0) {
      await this.prisma.storyCluster
        .delete({ where: { id: clusterId } })
        .catch(() => undefined);
      return;
    }

    const sources = new Set(members.map((m) => m.source));
    const languages = Array.from(
      new Set(members.map((m) => this.toLang(m.originalLanguage))),
    );

    const lead = this.pickLead(members);

    // Merge signatures across members (capped) so future candidate retrieval is
    // robust to the specific phrasing of any single headline.
    const entityKeys = this.mergeCapped(
      members.flatMap((m) => extractEntityKeys(m.title, m.content)),
      40,
    );
    const titleTokens = this.mergeCapped(
      members.flatMap((m) => normalizeTitleTokens(m.title, m.originalLanguage)),
      60,
    );

    const latestPublishedAt = members.reduce(
      (acc, m) => (m.publishedAt > acc ? m.publishedAt : acc),
      members[0].publishedAt,
    );

    const imageUrl = await this.pickBestImage(members, clusterId);

    await this.prisma.storyCluster.update({
      where: { id: clusterId },
      data: {
        canonicalTitle: lead.title,
        canonicalSummary: this.pickSummary(lead),
        imageUrl,
        category: lead.category,
        continent: lead.continent,
        region: lead.region,
        country: lead.country,
        entityKeys,
        titleTokens,
        sourceCount: sources.size,
        articleCount: members.length,
        languages,
        leadArticleId: lead.id,
        latestPublishedAt,
      },
    });
  }

  /**
   * Lead article = the most "complete" recent member: prefers one that has a
   * summary and a usable (non-logo) image, then newest.
   */
  private pickLead(members: ClusterableArticle[]): ClusterableArticle {
    const scored = [...members].sort((a, b) => {
      const sa = this.completeness(a);
      const sb = this.completeness(b);
      if (sb !== sa) return sb - sa;
      return b.publishedAt.getTime() - a.publishedAt.getTime();
    });
    return scored[0];
  }

  private completeness(a: ClusterableArticle): number {
    let s = 0;
    if (this.pickSummary(a)) s += 2;
    if (this.isUsableImage(a.imageUrl)) s += 1;
    return s;
  }

  private pickSummary(a: ClusterableArticle): string | null {
    return a.summary ?? a.summaryFr ?? a.summaryRw ?? null;
  }

  private isUsableImage(url: string | null): boolean {
    const clean = sanitizeImageUrl(url);
    return !!clean && !isLikelyGenericAsset(clean);
  }

  /**
   * Best cluster image: a usable (non-logo/placeholder) member image whose
   * fingerprint is not already used by another recent cluster, to avoid the
   * same hero photo repeating across the feed. Falls back to null over a logo.
   */
  private async pickBestImage(
    members: ClusterableArticle[],
    clusterId: string,
  ): Promise<string | null> {
    const usable = members
      .map((m) => sanitizeImageUrl(m.imageUrl))
      .filter((u): u is string => !!u && !isLikelyGenericAsset(u));

    if (usable.length === 0) return null;

    const since = new Date(Date.now() - 7 * 24 * 3_600_000);
    const recentClusters = await this.prisma.storyCluster.findMany({
      where: {
        id: { not: clusterId },
        imageUrl: { not: null },
        latestPublishedAt: { gte: since },
      },
      select: { imageUrl: true },
      take: 500,
    });
    const usedFingerprints = new Set(
      recentClusters
        .map((c) => c.imageUrl)
        .filter((u): u is string => !!u)
        .map((u) => fingerprintCanonicalImageUrl(u)),
    );

    const fresh = usable.find(
      (u) => !usedFingerprints.has(fingerprintCanonicalImageUrl(u)),
    );
    return fresh ?? usable[0];
  }

  private mergeCapped(values: string[], cap: number): string[] {
    return Array.from(new Set(values)).slice(0, cap);
  }

  private toLang(language: string): string {
    if (language === 'fr' || language === 'rw') return language;
    return 'en';
  }
}
