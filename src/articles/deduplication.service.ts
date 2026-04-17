import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NormalizedArticle } from '../rss/rss.service';

const TITLE_SIMILARITY_THRESHOLD = 0.75;

@Injectable()
export class DeduplicationService {
  private readonly logger = new Logger(DeduplicationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async filterDuplicates(articles: NormalizedArticle[]): Promise<NormalizedArticle[]> {
    const urls = articles.map((a) => a.url);

    // Fetch all existing URLs in one query
    const existing = await this.prisma.article.findMany({
      where: { url: { in: urls } },
      select: { url: true, title: true },
    });

    const existingUrlSet = new Set(existing.map((e) => e.url));
    const existingTitles = existing.map((e) => e.title.toLowerCase());

    const unique: NormalizedArticle[] = [];
    const seenUrls = new Set<string>();
    const seenTitles: string[] = [];

    for (const article of articles) {
      // Skip if URL already in DB or seen in current batch
      if (existingUrlSet.has(article.url) || seenUrls.has(article.url)) {
        continue;
      }

      const titleLower = article.title.toLowerCase();

      // Check similarity against DB titles and current batch
      const allTitles = [...existingTitles, ...seenTitles];
      const isDuplicate = allTitles.some(
        (t) => this.similarity(t, titleLower) >= TITLE_SIMILARITY_THRESHOLD,
      );

      if (!isDuplicate) {
        unique.push(article);
        seenUrls.add(article.url);
        seenTitles.push(titleLower);
      }
    }

    this.logger.debug(
      `Deduplication: ${articles.length} in → ${unique.length} unique`,
    );
    return unique;
  }

  private similarity(a: string, b: string): number {
    if (a === b) return 1;
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    if (longer.length === 0) return 1;
    const editDist = this.levenshtein(longer, shorter);
    return (longer.length - editDist) / longer.length;
  }

  private levenshtein(a: string, b: string): number {
    const dp = Array.from({ length: a.length + 1 }, (_, i) =>
      Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
    );
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[a.length][b.length];
  }
}
