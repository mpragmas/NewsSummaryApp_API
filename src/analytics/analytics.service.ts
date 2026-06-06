import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, AnalyticsEventType } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsRepository, DateRange } from './analytics.repository';
import { TrackEventDto } from './dto/track-event.dto';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { RequestContext } from './request-context.util';

interface IngestActor {
  userId?: string | null;
  ctx: RequestContext;
}

/** In-memory write buffers — flushed in batches so user requests never block. */
@Injectable()
export class AnalyticsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AnalyticsService.name);

  private eventBuffer: Prisma.AnalyticsEventCreateManyInput[] = [];
  private impressionBuffer: Prisma.StoryImpressionCreateManyInput[] = [];
  private clickBuffer: Prisma.ExternalClickCreateManyInput[] = [];

  private flushTimer?: NodeJS.Timeout;
  private flushing = false;

  /** Flush when either threshold is hit. */
  private static readonly FLUSH_INTERVAL_MS = 5_000;
  private static readonly MAX_BUFFER = 500;

  /** De-dupe session touches so we don't write a session row per event. */
  private readonly recentlyTouched = new Map<string, number>();
  private static readonly SESSION_TOUCH_TTL_MS = 60_000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: AnalyticsRepository,
  ) {}

  onModuleInit() {
    this.flushTimer = setInterval(() => {
      void this.flush();
    }, AnalyticsService.FLUSH_INTERVAL_MS);
    // Don't keep the event loop alive solely for the flush timer.
    this.flushTimer.unref?.();
  }

  async onModuleDestroy() {
    if (this.flushTimer) clearInterval(this.flushTimer);
    await this.flush();
  }

  // ── Write path ───────────────────────────────────────────────────────────────

  /** Accept a batch of client events. Never throws to the caller. */
  ingestBatch(events: TrackEventDto[], actor: IngestActor): { accepted: number } {
    let accepted = 0;
    for (const e of events) {
      try {
        this.enqueueEvent(e, actor);
        accepted++;
      } catch (err) {
        this.logger.warn(`Dropped malformed analytics event: ${String(err)}`);
      }
    }
    this.maybeTouchSession(events, actor);
    if (this.bufferedCount() >= AnalyticsService.MAX_BUFFER) {
      void this.flush();
    }
    return { accepted };
  }

  private enqueueEvent(e: TrackEventDto, actor: IngestActor): void {
    const { ctx, userId } = actor;
    const anonymous = !userId;

    this.eventBuffer.push({
      type: e.type,
      sessionId: e.sessionId,
      userId: userId ?? null,
      anonymous,
      articleId: e.articleId ?? null,
      clusterId: e.clusterId ?? null,
      source: e.source ?? null,
      category: e.category ?? null,
      language: e.language ?? null,
      country: ctx.country ?? null,
      region: e.region ?? ctx.region ?? null,
      device: ctx.device,
      referrer: ctx.referrer ?? null,
      query: e.query ? e.query.trim().slice(0, 200) : null,
      resultCount: e.resultCount ?? null,
      durationMs: e.durationMs ?? null,
    });

    // Mirror impressions into the dedicated high-volume table for fast CTR math.
    if (e.type === AnalyticsEventType.STORY_IMPRESSION) {
      this.impressionBuffer.push({
        clusterId: e.clusterId ?? null,
        articleId: e.articleId ?? null,
        sessionId: e.sessionId,
        userId: userId ?? null,
        source: e.source ?? null,
        category: e.category ?? null,
        language: e.language ?? null,
        country: ctx.country ?? null,
        device: ctx.device,
      });
    }
  }

  /**
   * Record an outbound publisher click (from the /out redirect). Buffered like
   * everything else, plus an EXTERNAL_CLICK row in the generic event stream.
   */
  recordExternalClick(params: {
    articleId: string;
    clusterId?: string | null;
    source: string;
    targetUrl: string;
    sessionId?: string;
    category?: string | null;
    language?: string | null;
    actor: IngestActor;
  }): void {
    const { actor } = params;
    const anonymous = !actor.userId;

    this.clickBuffer.push({
      articleId: params.articleId,
      clusterId: params.clusterId ?? null,
      source: params.source,
      targetUrl: params.targetUrl.slice(0, 2048),
      sessionId: params.sessionId ?? null,
      userId: actor.userId ?? null,
      anonymous,
      device: actor.ctx.device,
      country: actor.ctx.country ?? null,
      region: actor.ctx.region ?? null,
      referrer: actor.ctx.referrer ?? null,
    });

    this.eventBuffer.push({
      type: AnalyticsEventType.EXTERNAL_CLICK,
      sessionId: params.sessionId ?? 'server',
      userId: actor.userId ?? null,
      anonymous,
      articleId: params.articleId,
      clusterId: params.clusterId ?? null,
      source: params.source,
      category: params.category ?? null,
      language: params.language ?? null,
      country: actor.ctx.country ?? null,
      region: actor.ctx.region ?? null,
      device: actor.ctx.device,
      referrer: actor.ctx.referrer ?? null,
    });

    if (this.bufferedCount() >= AnalyticsService.MAX_BUFFER) {
      void this.flush();
    }
  }

  private maybeTouchSession(events: TrackEventDto[], actor: IngestActor): void {
    const sessionId = events.find((e) => e.sessionId)?.sessionId;
    if (!sessionId) return;
    const now = Date.now();
    const last = this.recentlyTouched.get(sessionId) ?? 0;
    if (now - last < AnalyticsService.SESSION_TOUCH_TTL_MS) return;
    this.recentlyTouched.set(sessionId, now);
    this.pruneTouchCache(now);

    const language = events.find((e) => e.language)?.language;
    // Fire-and-forget — session bookkeeping must never block the response.
    void this.repo
      .touchSession({
        anonId: sessionId,
        userId: actor.userId ?? null,
        device: actor.ctx.device,
        country: actor.ctx.country,
        region: actor.ctx.region,
        referrer: actor.ctx.referrer,
        language,
        userAgent: actor.ctx.userAgent,
      })
      .catch((err) =>
        this.logger.warn(`Session touch failed: ${(err as Error).message}`),
      );
  }

  private pruneTouchCache(now: number): void {
    if (this.recentlyTouched.size < 10_000) return;
    for (const [k, t] of this.recentlyTouched) {
      if (now - t > AnalyticsService.SESSION_TOUCH_TTL_MS) {
        this.recentlyTouched.delete(k);
      }
    }
  }

  private bufferedCount(): number {
    return (
      this.eventBuffer.length +
      this.impressionBuffer.length +
      this.clickBuffer.length
    );
  }

  /** Persist all buffers. Safe to call concurrently (guarded). */
  async flush(): Promise<void> {
    if (this.flushing) return;
    if (this.bufferedCount() === 0) return;
    this.flushing = true;

    const events = this.eventBuffer;
    const impressions = this.impressionBuffer;
    const clicks = this.clickBuffer;
    this.eventBuffer = [];
    this.impressionBuffer = [];
    this.clickBuffer = [];

    try {
      await Promise.all([
        this.repo.bulkInsertEvents(events),
        this.repo.bulkInsertImpressions(impressions),
        this.repo.bulkInsertClicks(clicks),
      ]);
    } catch (err) {
      this.logger.error(
        `Analytics flush failed (${events.length}+${impressions.length}+${clicks.length} rows dropped): ${(err as Error).message}`,
      );
    } finally {
      this.flushing = false;
    }
  }

  // ── Read path (admin dashboards) ──────────────────────────────────────────────

  resolveRange(q: AnalyticsQueryDto): DateRange {
    const to = q.to ? new Date(q.to) : new Date();
    let from: Date;
    if (q.from) {
      from = new Date(q.from);
    } else {
      const days = q.days ?? 30;
      from = new Date(to.getTime() - days * 86_400_000);
    }
    if (Number.isNaN(from.getTime())) from = new Date(Date.now() - 30 * 86_400_000);
    if (Number.isNaN(to.getTime())) return { from, to: new Date() };
    return { from, to };
  }

  async getOverview(q: AnalyticsQueryDto) {
    const range = this.resolveRange(q);
    const interval = q.interval ?? 'day';

    const [
      userTotals,
      dau,
      wau,
      mau,
      live,
      storiesRead,
      outboundClicks,
      impressions,
      avgSession,
      avgDepth,
      returning,
      guestSplit,
      clickSeries,
      activeSeries,
      readsSeries,
    ] = await Promise.all([
      this.repo.userTotals(range),
      this.repo.activeSessions(1),
      this.repo.activeSessions(7),
      this.repo.activeSessions(30),
      this.repo.liveSessions(5),
      this.repo.countEvents(AnalyticsEventType.ARTICLE_OPEN, range),
      this.repo.countClicks(range),
      this.repo.countImpressions(range),
      this.repo.avgSessionDurationMs(range),
      this.repo.avgSessionDepth(range),
      this.repo.returningUsers(range),
      this.repo.guestVsRegistered(range),
      this.repo.clickTimeSeries(range, interval),
      this.repo.activeUsersTimeSeries(range),
      this.repo.eventTimeSeries(AnalyticsEventType.ARTICLE_OPEN, range, interval),
    ]);

    const engagementRate =
      impressions > 0 ? Math.round((outboundClicks / impressions) * 1000) / 10 : 0;

    return {
      range: { from: range.from.toISOString(), to: range.to.toISOString() },
      totals: {
        totalUsers: userTotals.total,
        newUsers: userTotals.newUsers,
        liveUsers: live,
        dau,
        wau,
        mau,
        storiesRead,
        outboundClicks,
        impressions,
        engagementRate,
        avgSessionMs: avgSession,
        avgSessionDepth: avgDepth,
        returningUsers: returning.returning,
        newVisitors: returning.newVisitors,
        guestUsers: guestSplit.guest,
        registeredUsers: guestSplit.registered,
      },
      series: {
        outboundClicks: clickSeries,
        activeUsers: activeSeries,
        storiesRead: readsSeries,
      },
    };
  }

  async getPublishers(q: AnalyticsQueryDto) {
    const range = this.resolveRange(q);
    const limit = q.limit ?? 50;
    const publishers = await this.repo.publisherBreakdown(range, limit);

    // Attach top categories for the leading publishers only (bounded fan-out).
    const top = publishers.slice(0, 8);
    const withCategories = await Promise.all(
      top.map(async (p) => ({
        ...p,
        topCategories: await this.repo.publisherTopCategories(p.source, range, 5),
      })),
    );
    const rest = publishers.slice(8).map((p) => ({ ...p, topCategories: [] }));

    const totals = publishers.reduce(
      (acc, p) => {
        acc.clicks += p.clicks;
        acc.impressions += p.impressions;
        acc.uniqueUsers += p.uniqueUsers;
        return acc;
      },
      { clicks: 0, impressions: 0, uniqueUsers: 0 },
    );

    return {
      range: { from: range.from.toISOString(), to: range.to.toISOString() },
      totals: {
        ...totals,
        ctr:
          totals.impressions > 0
            ? Math.round((totals.clicks / totals.impressions) * 1000) / 10
            : 0,
        publisherCount: publishers.length,
      },
      publishers: [...withCategories, ...rest],
    };
  }

  async getPublisherDetail(source: string, q: AnalyticsQueryDto) {
    const range = this.resolveRange(q);
    const interval = q.interval ?? 'day';
    const [breakdown, categories, clickSeries] = await Promise.all([
      this.repo.publisherBreakdown(range, 100),
      this.repo.publisherTopCategories(source, range, 10),
      this.repo.clickTimeSeries(range, interval, source),
    ]);
    const summary = breakdown.find((p) => p.source === source) ?? {
      source,
      clicks: 0,
      uniqueSessions: 0,
      uniqueUsers: 0,
      impressions: 0,
      ctr: 0,
    };
    return {
      range: { from: range.from.toISOString(), to: range.to.toISOString() },
      summary,
      topCategories: categories,
      series: { outboundClicks: clickSeries },
    };
  }

  async getUsers(q: AnalyticsQueryDto) {
    const range = this.resolveRange(q);
    const [
      guestSplit,
      returning,
      languages,
      countries,
      devices,
      regions,
      categories,
      avgSession,
      avgDepth,
      activeSeries,
    ] = await Promise.all([
      this.repo.guestVsRegistered(range),
      this.repo.returningUsers(range),
      this.repo.eventColumnBreakdown('language', range, 10),
      this.repo.countryBreakdown(range, 20),
      this.repo.deviceBreakdown(range),
      this.repo.eventColumnBreakdown('region', range, 15),
      this.repo.eventColumnBreakdown('category', range, 15),
      this.repo.avgSessionDurationMs(range),
      this.repo.avgSessionDepth(range),
      this.repo.activeUsersTimeSeries(range),
    ]);

    const totalDevices = guestSplit.guest + guestSplit.registered;
    const retentionRate =
      returning.returning + returning.newVisitors > 0
        ? Math.round(
            (returning.returning /
              (returning.returning + returning.newVisitors)) *
              1000,
          ) / 10
        : 0;

    return {
      range: { from: range.from.toISOString(), to: range.to.toISOString() },
      totals: {
        activeUsers: totalDevices,
        guestUsers: guestSplit.guest,
        registeredUsers: guestSplit.registered,
        returningUsers: returning.returning,
        newVisitors: returning.newVisitors,
        retentionRate,
        avgSessionMs: avgSession,
        avgSessionDepth: avgDepth,
      },
      breakdowns: {
        languages,
        countries,
        devices,
        regions,
        categories,
      },
      series: { activeUsers: activeSeries },
    };
  }

  async getStories(q: AnalyticsQueryDto) {
    const range = this.resolveRange(q);
    const stories = await this.repo.storyPerformance(range, q.limit ?? 50);
    return {
      range: { from: range.from.toISOString(), to: range.to.toISOString() },
      stories,
    };
  }

  async getSearch(q: AnalyticsQueryDto) {
    const range = this.resolveRange(q);
    const [top, failed, trending, total] = await Promise.all([
      this.repo.topSearches(range, q.limit ?? 25),
      this.repo.failedSearches(range, 25),
      this.repo.trendingSearches(range, 10),
      this.repo.countEvents(AnalyticsEventType.SEARCH, range),
    ]);
    const failedCount = failed.reduce((a, b) => a + b.count, 0);
    return {
      range: { from: range.from.toISOString(), to: range.to.toISOString() },
      totals: {
        totalSearches: total,
        failedSearches: failedCount,
        successRate:
          total > 0 ? Math.round(((total - failedCount) / total) * 1000) / 10 : 0,
      },
      topSearches: top,
      failedSearches: failed,
      trending,
    };
  }

  /** Look up the redirect target + publisher metadata for /out/:articleId. */
  async getRedirectTarget(articleId: string) {
    return this.prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        url: true,
        source: true,
        clusterId: true,
        category: true,
        originalLanguage: true,
      },
    });
  }
}
