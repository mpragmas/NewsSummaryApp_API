import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuestService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(expiresAt?: Date) {
    const session = await this.prisma.guestSession.create({
      data: expiresAt ? { expiresAt } : {},
      select: { id: true, createdAt: true, expiresAt: true },
    });
    return { guestSessionId: session.id, createdAt: session.createdAt, expiresAt: session.expiresAt };
  }

  async saveArticle(sessionId: string, articleId: string) {
    await this.ensureSession(sessionId);
    await this.ensureArticleExists(articleId);
    try {
      await this.prisma.guestSavedArticle.create({
        data: { guestSessionId: sessionId, articleId },
      });
    } catch {
      throw new ConflictException('Article already saved for this guest session');
    }
    return { saved: true, articleId, guestSessionId: sessionId };
  }

  async recordRead(sessionId: string, articleId: string) {
    await this.ensureSession(sessionId);
    await this.ensureArticleExists(articleId);
    await this.prisma.guestReadingHistory.upsert({
      where: { guestSessionId_articleId: { guestSessionId: sessionId, articleId } },
      create: { guestSessionId: sessionId, articleId },
      update: { readAt: new Date() },
    });
  }

  /**
   * Copies guest bookmarks and reading history into the user account, then deletes the guest session.
   */
  async mergeGuestSessionIntoUser(sessionId: string, userId: string): Promise<{
    mergedSaves: number;
    mergedReads: number;
  }> {
    const session = await this.prisma.guestSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Guest session not found');

    if (session.expiresAt && session.expiresAt < new Date()) {
      throw new BadRequestException('Guest session has expired');
    }

    return this.prisma.$transaction(async (tx) => {
      const saves = await tx.guestSavedArticle.findMany({
        where: { guestSessionId: sessionId },
      });

      let mergedSaves = 0;
      for (const s of saves) {
        try {
          await tx.savedArticle.create({
            data: {
              userId,
              articleId: s.articleId,
              savedAt: s.savedAt,
            },
          });
          mergedSaves++;
        } catch {
          // already saved by user — skip
        }
      }

      const reads = await tx.guestReadingHistory.findMany({
        where: { guestSessionId: sessionId },
      });

      let mergedReads = 0;
      for (const r of reads) {
        const existing = await tx.readingHistory.findUnique({
          where: { userId_articleId: { userId, articleId: r.articleId } },
        });
        const readAt =
          existing && existing.readAt > r.readAt ? existing.readAt : r.readAt;

        await tx.readingHistory.upsert({
          where: { userId_articleId: { userId, articleId: r.articleId } },
          create: { userId, articleId: r.articleId, readAt: r.readAt },
          update: { readAt },
        });
        mergedReads++;
      }

      await tx.guestSession.delete({ where: { id: sessionId } });

      return { mergedSaves, mergedReads };
    });
  }

  private async ensureSession(id: string) {
    const s = await this.prisma.guestSession.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Guest session not found');
    if (s.expiresAt && s.expiresAt < new Date()) {
      throw new BadRequestException('Guest session has expired');
    }
  }

  private async ensureArticleExists(articleId: string) {
    const exists = await this.prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException(`Article ${articleId} not found`);
  }
}
