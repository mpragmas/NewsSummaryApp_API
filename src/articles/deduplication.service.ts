import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NormalizedArticle } from '../rss/rss.service';

/**
 * Conservative deduplication.
 *
 * We deliberately do NOT remove similar stories from different sources — that
 * is the job of the clustering engine (`StoryClusteringService`), which groups
 * same-event articles into a `StoryCluster` while keeping every source.
 *
 * This stage only removes true duplicates:
 *   1. Exact same URL (already in DB, or repeated within the incoming batch).
 *   2. Exact duplicate from the SAME source (same source + identical
 *      normalized title) — e.g. an RSS feed re-publishing the same item.
 *
 * Cross-source near-duplicates are intentionally kept so BBC / France24 / CNN /
 * Al Jazeera coverage of the same event all survive and can be clustered.
 */
@Injectable()
export class DeduplicationService {
  private readonly logger = new Logger(DeduplicationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async filterDuplicates(
    articles: NormalizedArticle[],
  ): Promise<NormalizedArticle[]> {
    const urls = articles.map((a) => a.url);

    // Existing rows that collide on URL (indexed unique lookup). Same-source
    // exact reposts across runs almost always carry the same URL, so this also
    // covers the cross-run repost case without an unindexed full-table scan.
    const existing = await this.prisma.article.findMany({
      where: { url: { in: urls } },
      select: { url: true },
    });
    const existingUrlSet = new Set(existing.map((e) => e.url));

    const unique: NormalizedArticle[] = [];
    const seenUrls = new Set<string>();
    const seenSourceTitles = new Set<string>();

    for (const article of articles) {
      // 1. Exact URL duplicate (DB or earlier in this batch)
      if (existingUrlSet.has(article.url) || seenUrls.has(article.url)) {
        continue;
      }

      // 2. Same-source exact-title repost within this batch (e.g. a feed listing
      //    the same item twice, or RSS + scraper overlap in one run).
      const sourceTitleKey = this.sourceTitleKey(article.source, article.title);
      if (seenSourceTitles.has(sourceTitleKey)) {
        continue;
      }

      unique.push(article);
      seenUrls.add(article.url);
      seenSourceTitles.add(sourceTitleKey);
    }

    this.logger.debug(
      `Deduplication: ${articles.length} in → ${unique.length} kept ` +
        `(${articles.length - unique.length} exact/same-source duplicates dropped)`,
    );
    return unique;
  }

  /** Stable key for "same source + same headline" exact-repost detection. */
  private sourceTitleKey(source: string, title: string): string {
    const normalizedSource = (source ?? '').trim().toLowerCase();
    const normalizedTitle = (title ?? '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    return `${normalizedSource}::${normalizedTitle}`;
  }
}
