import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { AnalyticsAggregationService } from './analytics-aggregation.service';
import { BatchTrackDto, TrackEventDto } from './dto/track-event.dto';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { getRequestContext } from './request-context.util';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { AdminApiKeyGuard } from '../common/guards/admin-api-key.guard';
import { AuthUser } from '../auth/strategies/jwt.strategy';

interface AuthRequest extends Request {
  user?: AuthUser;
}

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analytics: AnalyticsService,
    private readonly aggregation: AnalyticsAggregationService,
  ) {}

  // ── Public tracking (guest + authenticated) ──────────────────────────────────

  /** Batch ingest from the web/mobile clients. Fire-and-forget, never blocks. */
  @Post('events')
  @UseGuards(OptionalJwtGuard)
  @Throttle({ default: { ttl: 60_000, limit: 600 } })
  @HttpCode(HttpStatus.ACCEPTED)
  track(@Body() body: BatchTrackDto, @Req() req: AuthRequest) {
    const ctx = getRequestContext(req);
    return this.analytics.ingestBatch(body.events ?? [], {
      userId: req.user?.userId,
      ctx,
    });
  }

  /** Single-event convenience endpoint (e.g. sendBeacon with one event). */
  @Post('event')
  @UseGuards(OptionalJwtGuard)
  @Throttle({ default: { ttl: 60_000, limit: 600 } })
  @HttpCode(HttpStatus.ACCEPTED)
  trackOne(@Body() body: TrackEventDto, @Req() req: AuthRequest) {
    const ctx = getRequestContext(req);
    return this.analytics.ingestBatch([body], {
      userId: req.user?.userId,
      ctx,
    });
  }

  // ── Admin dashboards (protected by X-Admin-Key) ──────────────────────────────

  @Get('overview')
  @UseGuards(AdminApiKeyGuard)
  overview(@Query() q: AnalyticsQueryDto) {
    return this.analytics.getOverview(q);
  }

  @Get('publishers')
  @UseGuards(AdminApiKeyGuard)
  publishers(@Query() q: AnalyticsQueryDto) {
    return this.analytics.getPublishers(q);
  }

  @Get('publishers/:source')
  @UseGuards(AdminApiKeyGuard)
  publisherDetail(@Param('source') source: string, @Query() q: AnalyticsQueryDto) {
    return this.analytics.getPublisherDetail(source, q);
  }

  @Get('users')
  @UseGuards(AdminApiKeyGuard)
  users(@Query() q: AnalyticsQueryDto) {
    return this.analytics.getUsers(q);
  }

  @Get('stories')
  @UseGuards(AdminApiKeyGuard)
  stories(@Query() q: AnalyticsQueryDto) {
    return this.analytics.getStories(q);
  }

  @Get('search')
  @UseGuards(AdminApiKeyGuard)
  search(@Query() q: AnalyticsQueryDto) {
    return this.analytics.getSearch(q);
  }

  /** Lightweight check the admin UI uses to validate the entered key. */
  @Get('verify')
  @UseGuards(AdminApiKeyGuard)
  verify() {
    return { ok: true };
  }

  /** Force a publisher daily-stat rebuild over the trailing window. */
  @Post('rebuild')
  @UseGuards(AdminApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  rebuild(@Query('days') days?: number) {
    return this.aggregation.rebuildRange(days ? Number(days) : 30);
  }
}
