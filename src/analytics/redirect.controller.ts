import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { getRequestContext } from './request-context.util';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { AuthUser } from '../auth/strategies/jwt.strategy';

interface AuthRequest extends Request {
  user?: AuthUser;
}

/**
 * Outbound link tracker. Instead of linking readers straight to a publisher,
 * the client points "Read full article on Igihe" at `/out/:articleId`. We record
 * the click (publisher, article, session, device, country, referrer) and then
 * 302 the reader to the real article URL.
 *
 * This is what lets us tell publishers "we sent you N readers this month".
 *
 * Mounted OUTSIDE the /api/v1 prefix (see main.ts) so it's a clean, shareable
 * URL and so the global response envelope/interceptor is bypassed (we redirect).
 */
@Controller('out')
export class RedirectController {
  private static readonly UUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  constructor(private readonly analytics: AnalyticsService) {}

  @Get(':articleId')
  @UseGuards(OptionalJwtGuard)
  async out(
    @Param('articleId') articleId: string,
    @Query('s') sessionId: string | undefined,
    @Req() req: AuthRequest,
    @Res() res: Response,
  ): Promise<void> {
    const fallback = process.env.WEB_APP_URL || process.env.APP_URL || '/';

    if (!RedirectController.UUID.test(articleId)) {
      res.redirect(302, fallback);
      return;
    }

    const article = await this.analytics.getRedirectTarget(articleId);
    if (!article?.url) {
      res.redirect(302, fallback);
      return;
    }

    const ctx = getRequestContext(req);
    const cleanSession =
      sessionId && sessionId.length <= 128 ? sessionId : undefined;

    // Buffered, non-blocking — recording must not delay the redirect.
    try {
      this.analytics.recordExternalClick({
        articleId: article.id,
        clusterId: article.clusterId,
        source: article.source,
        targetUrl: article.url,
        sessionId: cleanSession,
        category: article.category,
        language: article.originalLanguage,
        actor: { userId: req.user?.userId, ctx },
      });
    } catch {
      // Never let analytics failures break the user's navigation.
    }

    // 302 (not 301) so the tracker is hit on every click, not cached.
    res.redirect(302, article.url);
  }
}
