import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        preferredLanguage: true,
        favoriteTopics: true,
        dailyDigest: true,
        breakingNews: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { dailyDigest, breakingNews, ...rest } = user;
    return {
      ...rest,
      notificationPreferences: { dailyDigest, breakingNews },
    };
  }

  /** Used by article list personalization (language view + optional category filter). */
  async getPersonalizationForFeed(userId: string): Promise<{
    preferredLanguage: 'en' | 'fr' | 'rw';
    favoriteTopics: string[];
  } | null> {
    const row = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { preferredLanguage: true, favoriteTopics: true },
    });
    if (!row) return null;
    return {
      preferredLanguage: row.preferredLanguage as 'en' | 'fr' | 'rw',
      favoriteTopics: row.favoriteTopics,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.ensureExists(userId);
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        preferredLanguage: true,
        favoriteTopics: true,
        dailyDigest: true,
        breakingNews: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const { dailyDigest, breakingNews, ...rest } = updated;
    return {
      ...rest,
      notificationPreferences: { dailyDigest, breakingNews },
    };
  }

  async saveArticle(userId: string, articleId: string) {
    await this.ensureArticleExists(articleId);
    try {
      await this.prisma.savedArticle.create({ data: { userId, articleId } });
    } catch {
      // unique constraint → already saved
      throw new ConflictException('Article already saved');
    }
    return { saved: true, articleId };
  }

  async unsaveArticle(userId: string, articleId: string) {
    const record = await this.prisma.savedArticle.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
    if (!record) throw new NotFoundException('Saved article not found');
    await this.prisma.savedArticle.delete({
      where: { userId_articleId: { userId, articleId } },
    });
    return { saved: false, articleId };
  }

  async getSavedArticles(userId: string, lang?: 'en' | 'fr' | 'rw') {
    const rows = await this.prisma.savedArticle.findMany({
      where: { userId },
      orderBy: { savedAt: 'desc' },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            summary: true,
            summaryFr: true,
            summaryRw: true,
            originalLanguage: true,
            source: true,
            url: true,
            imageUrl: true,
            category: true,
            continent: true,
            region: true,
            country: true,
            publishedAt: true,
            createdAt: true,
          },
        },
      },
    });

    return rows.map(({ savedAt, article }) => ({
      savedAt,
      ...this.applyLangView(article, lang),
    }));
  }

  async recordRead(userId: string, articleId: string) {
    await this.prisma.readingHistory.upsert({
      where: { userId_articleId: { userId, articleId } },
      create: { userId, articleId },
      // On re-read, bump the timestamp by replacing the row
      update: { readAt: new Date() },
    });
  }

  async getReadingHistory(userId: string, lang?: 'en' | 'fr' | 'rw') {
    const rows = await this.prisma.readingHistory.findMany({
      where: { userId },
      orderBy: { readAt: 'desc' },
      take: 100,
      include: {
        article: {
          select: {
            id: true,
            title: true,
            summary: true,
            summaryFr: true,
            summaryRw: true,
            originalLanguage: true,
            source: true,
            url: true,
            imageUrl: true,
            category: true,
            continent: true,
            region: true,
            country: true,
            publishedAt: true,
            createdAt: true,
          },
        },
      },
    });

    return rows.map(({ readAt, article }) => ({
      readAt,
      ...this.applyLangView(article, lang),
    }));
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private applyLangView(
    article: {
      id: string;
      title: string;
      summary: string | null;
      summaryFr: string | null;
      summaryRw: string | null;
      originalLanguage: string;
      source: string;
      url: string;
      imageUrl: string | null;
      category: string | null;
      continent: string | null;
      region: string | null;
      country: string | null;
      publishedAt: Date;
      createdAt: Date;
    },
    lang?: 'en' | 'fr' | 'rw',
  ) {
    const summary =
      lang === 'fr'
        ? (article.summaryFr ?? article.summary ?? article.summaryRw)
        : lang === 'rw'
          ? (article.summaryRw ?? article.summary ?? article.summaryFr)
          : (article.summary ?? article.summaryFr ?? article.summaryRw);

    const { summaryFr: _fr, summaryRw: _rw, ...rest } = article;
    void _fr;
    void _rw;
    return { ...rest, summary, imageUrl: this.normalizeImageUrl(article.imageUrl) };
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

  private async ensureExists(userId: string) {
    const exists = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!exists) throw new NotFoundException('User not found');
  }

  private async ensureArticleExists(articleId: string) {
    const exists = await this.prisma.article.findUnique({ where: { id: articleId }, select: { id: true } });
    if (!exists) throw new NotFoundException(`Article ${articleId} not found`);
  }
}
