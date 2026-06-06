import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface TimeBucket {
  bucket: string;
  value: number;
}

export interface NameCount {
  name: string;
  count: number;
}

/**
 * All read aggregations + bulk writes for analytics. Keeps SQL/Prisma details
 * out of the service. Counts are cast to int/float in SQL so we never leak
 * BigInt into JSON responses.
 */
@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── Writes ────────────────────────────────────────────────────────────────

  bulkInsertEvents(rows: Prisma.AnalyticsEventCreateManyInput[]) {
    if (!rows.length) return Promise.resolve({ count: 0 });
    return this.prisma.analyticsEvent.createMany({ data: rows });
  }

  bulkInsertImpressions(rows: Prisma.StoryImpressionCreateManyInput[]) {
    if (!rows.length) return Promise.resolve({ count: 0 });
    return this.prisma.storyImpression.createMany({ data: rows });
  }

  bulkInsertClicks(rows: Prisma.ExternalClickCreateManyInput[]) {
    if (!rows.length) return Promise.resolve({ count: 0 });
    return this.prisma.externalClick.createMany({ data: rows });
  }

  /**
   * Upsert the rolling session row for an anonymous client. A new session is
   * started when the previous one was last seen more than `gapMinutes` ago.
   */
  async touchSession(params: {
    anonId: string;
    userId?: string | null;
    device: string;
    country?: string;
    region?: string;
    referrer?: string;
    language?: string;
    userAgent?: string;
    gapMinutes?: number;
  }): Promise<void> {
    const gap = params.gapMinutes ?? 30;
    const now = new Date();
    const cutoff = new Date(now.getTime() - gap * 60_000);

    const existing = await this.prisma.userSession.findFirst({
      where: { anonId: params.anonId, lastSeenAt: { gte: cutoff }, endedAt: null },
      orderBy: { lastSeenAt: 'desc' },
    });

    if (!existing) {
      await this.prisma.userSession.create({
        data: {
          anonId: params.anonId,
          userId: params.userId ?? null,
          device: params.device as never,
          country: params.country,
          region: params.region,
          referrer: params.referrer,
          language: params.language,
          eventCount: 1,
          pageviews: 1,
        },
      });
      return;
    }

    await this.prisma.userSession.update({
      where: { id: existing.id },
      data: {
        lastSeenAt: now,
        durationMs: now.getTime() - existing.startedAt.getTime(),
        eventCount: { increment: 1 },
        userId: params.userId ?? existing.userId,
        language: params.language ?? existing.language,
      },
    });
  }

  // ── Scalar metrics ──────────────────────────────────────────────────────────

  /** Distinct sessions active within the trailing window (now - days). */
  async activeSessions(days: number): Promise<number> {
    const since = new Date(Date.now() - days * 86_400_000);
    const rows = await this.prisma.$queryRaw<{ c: number }[]>`
      SELECT COUNT(DISTINCT "anonId")::int AS c
      FROM "user_sessions"
      WHERE "lastSeenAt" >= ${since}
    `;
    return rows[0]?.c ?? 0;
  }

  /** Sessions seen in the last `minutes` — the "live now" gauge. */
  async liveSessions(minutes = 5): Promise<number> {
    const since = new Date(Date.now() - minutes * 60_000);
    const rows = await this.prisma.$queryRaw<{ c: number }[]>`
      SELECT COUNT(DISTINCT "anonId")::int AS c
      FROM "user_sessions"
      WHERE "lastSeenAt" >= ${since}
    `;
    return rows[0]?.c ?? 0;
  }

  countEvents(type: Prisma.EnumAnalyticsEventTypeFilter | string, range: DateRange) {
    return this.prisma.analyticsEvent.count({
      where: {
        type: type as never,
        createdAt: { gte: range.from, lte: range.to },
      },
    });
  }

  countClicks(range: DateRange, source?: string) {
    return this.prisma.externalClick.count({
      where: {
        createdAt: { gte: range.from, lte: range.to },
        ...(source ? { source } : {}),
      },
    });
  }

  countImpressions(range: DateRange, source?: string) {
    return this.prisma.storyImpression.count({
      where: {
        createdAt: { gte: range.from, lte: range.to },
        ...(source ? { source } : {}),
      },
    });
  }

  /** Average session duration (ms) over completed-enough sessions in range. */
  async avgSessionDurationMs(range: DateRange): Promise<number> {
    const rows = await this.prisma.$queryRaw<{ avg: number | null }[]>`
      SELECT AVG("durationMs")::float AS avg
      FROM "user_sessions"
      WHERE "startedAt" >= ${range.from} AND "startedAt" <= ${range.to}
        AND "durationMs" > 0
    `;
    return Math.round(rows[0]?.avg ?? 0);
  }

  /** Average events (depth) per session in range. */
  async avgSessionDepth(range: DateRange): Promise<number> {
    const rows = await this.prisma.$queryRaw<{ avg: number | null }[]>`
      SELECT AVG("eventCount")::float AS avg
      FROM "user_sessions"
      WHERE "startedAt" >= ${range.from} AND "startedAt" <= ${range.to}
    `;
    return Math.round((rows[0]?.avg ?? 0) * 10) / 10;
  }

  /** Registered users total + new in range. */
  async userTotals(range: DateRange): Promise<{ total: number; newUsers: number }> {
    const [total, newUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { createdAt: { gte: range.from, lte: range.to } },
      }),
    ]);
    return { total, newUsers };
  }

  /** Guest vs registered split across sessions in range. */
  async guestVsRegistered(
    range: DateRange,
  ): Promise<{ guest: number; registered: number }> {
    const rows = await this.prisma.$queryRaw<
      { registered: number; guest: number }[]
    >`
      SELECT
        COUNT(DISTINCT "anonId") FILTER (WHERE "userId" IS NOT NULL)::int AS registered,
        COUNT(DISTINCT "anonId") FILTER (WHERE "userId" IS NULL)::int AS guest
      FROM "user_sessions"
      WHERE "startedAt" >= ${range.from} AND "startedAt" <= ${range.to}
    `;
    return { guest: rows[0]?.guest ?? 0, registered: rows[0]?.registered ?? 0 };
  }

  /** Returning vs new devices: anonIds in range that also existed before it. */
  async returningUsers(
    range: DateRange,
  ): Promise<{ returning: number; newVisitors: number }> {
    const rows = await this.prisma.$queryRaw<
      { returning: number; total: number }[]
    >`
      WITH in_range AS (
        SELECT DISTINCT "anonId"
        FROM "user_sessions"
        WHERE "startedAt" >= ${range.from} AND "startedAt" <= ${range.to}
      )
      SELECT
        COUNT(*) FILTER (
          WHERE EXISTS (
            SELECT 1 FROM "user_sessions" s
            WHERE s."anonId" = in_range."anonId" AND s."startedAt" < ${range.from}
          )
        )::int AS returning,
        COUNT(*)::int AS total
      FROM in_range
    `;
    const total = rows[0]?.total ?? 0;
    const returning = rows[0]?.returning ?? 0;
    return { returning, newVisitors: Math.max(0, total - returning) };
  }

  // ── Time series ──────────────────────────────────────────────────────────────

  /**
   * Daily/hourly counts of a given event type, gap-filled with zeros so charts
   * render a continuous line.
   */
  async eventTimeSeries(
    type: string,
    range: DateRange,
    interval: 'day' | 'hour' = 'day',
  ): Promise<TimeBucket[]> {
    const trunc = interval === 'hour' ? 'hour' : 'day';
    const step = interval === 'hour' ? '1 hour' : '1 day';
    const rows = await this.prisma.$queryRaw<{ bucket: Date; value: number }[]>`
      SELECT g.bucket AS bucket, COALESCE(e.cnt, 0)::int AS value
      FROM generate_series(
        date_trunc(${trunc}, ${range.from}::timestamp),
        date_trunc(${trunc}, ${range.to}::timestamp),
        ${step}::interval
      ) AS g(bucket)
      LEFT JOIN (
        SELECT date_trunc(${trunc}, "createdAt") AS bucket, COUNT(*) AS cnt
        FROM "analytics_events"
        WHERE "type" = ${type}::"AnalyticsEventType"
          AND "createdAt" >= ${range.from} AND "createdAt" <= ${range.to}
        GROUP BY 1
      ) AS e ON e.bucket = g.bucket
      ORDER BY g.bucket ASC
    `;
    return rows.map((r) => ({ bucket: r.bucket.toISOString(), value: r.value }));
  }

  /** Outbound click time-series (optionally filtered to one publisher). */
  async clickTimeSeries(
    range: DateRange,
    interval: 'day' | 'hour' = 'day',
    source?: string,
  ): Promise<TimeBucket[]> {
    const trunc = interval === 'hour' ? 'hour' : 'day';
    const step = interval === 'hour' ? '1 hour' : '1 day';
    const sourceFilter = source
      ? Prisma.sql`AND "source" = ${source}`
      : Prisma.empty;
    const rows = await this.prisma.$queryRaw<{ bucket: Date; value: number }[]>`
      SELECT g.bucket AS bucket, COALESCE(e.cnt, 0)::int AS value
      FROM generate_series(
        date_trunc(${trunc}, ${range.from}::timestamp),
        date_trunc(${trunc}, ${range.to}::timestamp),
        ${step}::interval
      ) AS g(bucket)
      LEFT JOIN (
        SELECT date_trunc(${trunc}, "createdAt") AS bucket, COUNT(*) AS cnt
        FROM "external_clicks"
        WHERE "createdAt" >= ${range.from} AND "createdAt" <= ${range.to}
        ${sourceFilter}
        GROUP BY 1
      ) AS e ON e.bucket = g.bucket
      ORDER BY g.bucket ASC
    `;
    return rows.map((r) => ({ bucket: r.bucket.toISOString(), value: r.value }));
  }

  /** Distinct active sessions per day — the DAU trend line. */
  async activeUsersTimeSeries(range: DateRange): Promise<TimeBucket[]> {
    const rows = await this.prisma.$queryRaw<{ bucket: Date; value: number }[]>`
      SELECT g.bucket AS bucket, COALESCE(e.cnt, 0)::int AS value
      FROM generate_series(
        date_trunc('day', ${range.from}::timestamp),
        date_trunc('day', ${range.to}::timestamp),
        '1 day'::interval
      ) AS g(bucket)
      LEFT JOIN (
        SELECT date_trunc('day', "lastSeenAt") AS bucket,
               COUNT(DISTINCT "anonId") AS cnt
        FROM "user_sessions"
        WHERE "lastSeenAt" >= ${range.from} AND "lastSeenAt" <= ${range.to}
        GROUP BY 1
      ) AS e ON e.bucket = g.bucket
      ORDER BY g.bucket ASC
    `;
    return rows.map((r) => ({ bucket: r.bucket.toISOString(), value: r.value }));
  }

  // ── Breakdowns ───────────────────────────────────────────────────────────────

  /** Publisher leaderboard: clicks, impressions, CTR, unique users referred. */
  async publisherBreakdown(
    range: DateRange,
    limit = 50,
  ): Promise<
    {
      source: string;
      clicks: number;
      uniqueSessions: number;
      uniqueUsers: number;
      impressions: number;
      ctr: number;
    }[]
  > {
    const rows = await this.prisma.$queryRaw<
      {
        source: string;
        clicks: number;
        uniquesessions: number;
        uniqueusers: number;
      }[]
    >`
      SELECT "source" AS source,
             COUNT(*)::int AS clicks,
             COUNT(DISTINCT "sessionId")::int AS uniquesessions,
             COUNT(DISTINCT "userId")::int AS uniqueusers
      FROM "external_clicks"
      WHERE "createdAt" >= ${range.from} AND "createdAt" <= ${range.to}
      GROUP BY "source"
      ORDER BY clicks DESC
      LIMIT ${limit}
    `;

    const impressionRows = await this.prisma.$queryRaw<
      { source: string; impressions: number }[]
    >`
      SELECT "source" AS source, COUNT(*)::int AS impressions
      FROM "story_impressions"
      WHERE "createdAt" >= ${range.from} AND "createdAt" <= ${range.to}
        AND "source" IS NOT NULL
      GROUP BY "source"
    `;
    const impMap = new Map(impressionRows.map((r) => [r.source, r.impressions]));

    return rows.map((r) => {
      const impressions = impMap.get(r.source) ?? 0;
      const ctr = impressions > 0 ? (r.clicks / impressions) * 100 : 0;
      return {
        source: r.source,
        clicks: r.clicks,
        uniqueSessions: r.uniquesessions,
        uniqueUsers: r.uniqueusers,
        impressions,
        ctr: Math.round(ctr * 10) / 10,
      };
    });
  }

  /** Top categories sent to a given publisher (from outbound clicks joined to articles). */
  async publisherTopCategories(
    source: string,
    range: DateRange,
    limit = 5,
  ): Promise<NameCount[]> {
    const rows = await this.prisma.$queryRaw<{ name: string; count: number }[]>`
      SELECT COALESCE(a."category", 'uncategorized') AS name, COUNT(*)::int AS count
      FROM "external_clicks" c
      JOIN "articles" a ON a."id" = c."articleId"
      WHERE c."source" = ${source}
        AND c."createdAt" >= ${range.from} AND c."createdAt" <= ${range.to}
      GROUP BY 1
      ORDER BY count DESC
      LIMIT ${limit}
    `;
    return rows;
  }

  /** Generic groupBy over analytics_events for a scalar column (language, country, device…). */
  async eventColumnBreakdown(
    column: 'language' | 'country' | 'region' | 'category' | 'device',
    range: DateRange,
    limit = 20,
  ): Promise<NameCount[]> {
    const col = Prisma.raw(`"${column}"`);
    const rows = await this.prisma.$queryRaw<{ name: string; count: number }[]>`
      SELECT COALESCE(${col}::text, 'unknown') AS name, COUNT(*)::int AS count
      FROM "analytics_events"
      WHERE "createdAt" >= ${range.from} AND "createdAt" <= ${range.to}
      GROUP BY 1
      ORDER BY count DESC
      LIMIT ${limit}
    `;
    return rows;
  }

  /** Device mix across sessions in range. */
  async deviceBreakdown(range: DateRange): Promise<NameCount[]> {
    const rows = await this.prisma.$queryRaw<{ name: string; count: number }[]>`
      SELECT "device"::text AS name, COUNT(DISTINCT "anonId")::int AS count
      FROM "user_sessions"
      WHERE "startedAt" >= ${range.from} AND "startedAt" <= ${range.to}
      GROUP BY 1
      ORDER BY count DESC
    `;
    return rows;
  }

  /** Country mix across sessions in range. */
  async countryBreakdown(range: DateRange, limit = 20): Promise<NameCount[]> {
    const rows = await this.prisma.$queryRaw<{ name: string; count: number }[]>`
      SELECT COALESCE("country", 'unknown') AS name, COUNT(DISTINCT "anonId")::int AS count
      FROM "user_sessions"
      WHERE "startedAt" >= ${range.from} AND "startedAt" <= ${range.to}
      GROUP BY 1
      ORDER BY count DESC
      LIMIT ${limit}
    `;
    return rows;
  }

  // ── Story performance ────────────────────────────────────────────────────────

  /** Per-story counters for one event type, keyed by clusterId. */
  private async eventCountByCluster(
    type: string,
    range: DateRange,
  ): Promise<Map<string, number>> {
    const rows = await this.prisma.$queryRaw<
      { id: string; count: number }[]
    >`
      SELECT "clusterId" AS id, COUNT(*)::int AS count
      FROM "analytics_events"
      WHERE "type" = ${type}::"AnalyticsEventType"
        AND "clusterId" IS NOT NULL
        AND "createdAt" >= ${range.from} AND "createdAt" <= ${range.to}
      GROUP BY "clusterId"
    `;
    return new Map(rows.map((r) => [r.id, r.count]));
  }

  /** Top stories ranked by outbound clicks, with the full performance funnel. */
  async storyPerformance(
    range: DateRange,
    limit = 50,
  ): Promise<
    {
      clusterId: string;
      title: string;
      impressions: number;
      opens: number;
      sourceSwitches: number;
      clicks: number;
      bookmarks: number;
      shares: number;
      ctr: number;
    }[]
  > {
    const clickRows = await this.prisma.$queryRaw<
      { id: string; count: number }[]
    >`
      SELECT "clusterId" AS id, COUNT(*)::int AS count
      FROM "external_clicks"
      WHERE "clusterId" IS NOT NULL
        AND "createdAt" >= ${range.from} AND "createdAt" <= ${range.to}
      GROUP BY "clusterId"
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    const impressionRows = await this.prisma.$queryRaw<
      { id: string; count: number }[]
    >`
      SELECT "clusterId" AS id, COUNT(*)::int AS count
      FROM "story_impressions"
      WHERE "clusterId" IS NOT NULL
        AND "createdAt" >= ${range.from} AND "createdAt" <= ${range.to}
      GROUP BY "clusterId"
    `;

    const [opens, switches, bookmarks, shares] = await Promise.all([
      this.eventCountByCluster('ARTICLE_OPEN', range),
      this.eventCountByCluster('SOURCE_SWITCH', range),
      this.eventCountByCluster('BOOKMARK', range),
      this.eventCountByCluster('SHARE', range),
    ]);

    const impMap = new Map(impressionRows.map((r) => [r.id, r.count]));
    const ids = clickRows.map((r) => r.id);
    const clusters = ids.length
      ? await this.prisma.storyCluster.findMany({
          where: { id: { in: ids } },
          select: { id: true, canonicalTitle: true },
        })
      : [];
    const titleMap = new Map(clusters.map((c) => [c.id, c.canonicalTitle]));

    return clickRows.map((r) => {
      const impressions = impMap.get(r.id) ?? 0;
      const ctr = impressions > 0 ? (r.count / impressions) * 100 : 0;
      return {
        clusterId: r.id,
        title: titleMap.get(r.id) ?? 'Unknown story',
        impressions,
        opens: opens.get(r.id) ?? 0,
        sourceSwitches: switches.get(r.id) ?? 0,
        clicks: r.count,
        bookmarks: bookmarks.get(r.id) ?? 0,
        shares: shares.get(r.id) ?? 0,
        ctr: Math.round(ctr * 10) / 10,
      };
    });
  }

  // ── Search analytics ─────────────────────────────────────────────────────────

  async topSearches(range: DateRange, limit = 20): Promise<NameCount[]> {
    const rows = await this.prisma.$queryRaw<{ name: string; count: number }[]>`
      SELECT lower(trim("query")) AS name, COUNT(*)::int AS count
      FROM "analytics_events"
      WHERE "type" = 'SEARCH'::"AnalyticsEventType"
        AND "query" IS NOT NULL AND trim("query") <> ''
        AND "createdAt" >= ${range.from} AND "createdAt" <= ${range.to}
      GROUP BY 1
      ORDER BY count DESC
      LIMIT ${limit}
    `;
    return rows;
  }

  /** Searches that returned no results — content gaps worth filling. */
  async failedSearches(range: DateRange, limit = 20): Promise<NameCount[]> {
    const rows = await this.prisma.$queryRaw<{ name: string; count: number }[]>`
      SELECT lower(trim("query")) AS name, COUNT(*)::int AS count
      FROM "analytics_events"
      WHERE "type" = 'SEARCH'::"AnalyticsEventType"
        AND "query" IS NOT NULL AND trim("query") <> ''
        AND "resultCount" = 0
        AND "createdAt" >= ${range.from} AND "createdAt" <= ${range.to}
      GROUP BY 1
      ORDER BY count DESC
      LIMIT ${limit}
    `;
    return rows;
  }

  /** Keywords trending now vs the preceding window of equal length. */
  async trendingSearches(range: DateRange, limit = 10): Promise<NameCount[]> {
    const windowMs = range.to.getTime() - range.from.getTime();
    const prevFrom = new Date(range.from.getTime() - windowMs);
    const rows = await this.prisma.$queryRaw<{ name: string; count: number }[]>`
      WITH cur AS (
        SELECT lower(trim("query")) AS name, COUNT(*)::int AS c
        FROM "analytics_events"
        WHERE "type" = 'SEARCH'::"AnalyticsEventType"
          AND "query" IS NOT NULL AND trim("query") <> ''
          AND "createdAt" >= ${range.from} AND "createdAt" <= ${range.to}
        GROUP BY 1
      ), prev AS (
        SELECT lower(trim("query")) AS name, COUNT(*)::int AS c
        FROM "analytics_events"
        WHERE "type" = 'SEARCH'::"AnalyticsEventType"
          AND "query" IS NOT NULL AND trim("query") <> ''
          AND "createdAt" >= ${prevFrom} AND "createdAt" < ${range.from}
        GROUP BY 1
      )
      SELECT cur.name AS name, (cur.c - COALESCE(prev.c, 0))::int AS count
      FROM cur LEFT JOIN prev ON prev.name = cur.name
      WHERE cur.c - COALESCE(prev.c, 0) > 0
      ORDER BY count DESC
      LIMIT ${limit}
    `;
    return rows;
  }

  // ── Aggregation job ──────────────────────────────────────────────────────────

  /** Recompute the publisher daily rollup for a single day (idempotent upsert). */
  async rebuildPublisherDailyStats(day: Date): Promise<number> {
    const start = new Date(
      Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()),
    );
    const end = new Date(start.getTime() + 86_400_000);

    const clickRows = await this.prisma.$queryRaw<
      {
        source: string;
        clicks: number;
        uniquesessions: number;
        uniqueusers: number;
      }[]
    >`
      SELECT "source" AS source,
             COUNT(*)::int AS clicks,
             COUNT(DISTINCT "sessionId")::int AS uniquesessions,
             COUNT(DISTINCT "userId")::int AS uniqueusers
      FROM "external_clicks"
      WHERE "createdAt" >= ${start} AND "createdAt" < ${end}
      GROUP BY "source"
    `;

    const impressionRows = await this.prisma.$queryRaw<
      { source: string; impressions: number }[]
    >`
      SELECT "source" AS source, COUNT(*)::int AS impressions
      FROM "story_impressions"
      WHERE "createdAt" >= ${start} AND "createdAt" < ${end}
        AND "source" IS NOT NULL
      GROUP BY "source"
    `;
    const impMap = new Map(impressionRows.map((r) => [r.source, r.impressions]));

    const sources = new Set<string>([
      ...clickRows.map((r) => r.source),
      ...impressionRows.map((r) => r.source),
    ]);

    let written = 0;
    for (const source of sources) {
      const click = clickRows.find((r) => r.source === source);
      await this.prisma.publisherDailyStat.upsert({
        where: { date_publisher: { date: start, publisher: source } },
        create: {
          date: start,
          publisher: source,
          clicks: click?.clicks ?? 0,
          impressions: impMap.get(source) ?? 0,
          uniqueSessions: click?.uniquesessions ?? 0,
          uniqueUsers: click?.uniqueusers ?? 0,
        },
        update: {
          clicks: click?.clicks ?? 0,
          impressions: impMap.get(source) ?? 0,
          uniqueSessions: click?.uniquesessions ?? 0,
          uniqueUsers: click?.uniqueusers ?? 0,
        },
      });
      written++;
    }
    return written;
  }

  /** Mark sessions idle for `idleMinutes` as ended (frees the "live" gauge). */
  async closeStaleSessions(idleMinutes = 30): Promise<number> {
    const cutoff = new Date(Date.now() - idleMinutes * 60_000);
    const res = await this.prisma.userSession.updateMany({
      where: { endedAt: null, lastSeenAt: { lt: cutoff } },
      data: { endedAt: cutoff },
    });
    return res.count;
  }
}
