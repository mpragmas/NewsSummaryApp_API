import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnalyticsRepository } from './analytics.repository';

/**
 * Background rollups so partner/advertiser dashboards stay fast regardless of
 * raw event volume. Runs hourly: rebuilds today's + yesterday's publisher
 * daily stats (cheap, idempotent) and retires idle sessions.
 */
@Injectable()
export class AnalyticsAggregationService {
  private readonly logger = new Logger(AnalyticsAggregationService.name);

  constructor(private readonly repo: AnalyticsRepository) {}

  @Cron(CronExpression.EVERY_HOUR)
  async hourlyRollup(): Promise<void> {
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 86_400_000);
      const a = await this.repo.rebuildPublisherDailyStats(today);
      const b = await this.repo.rebuildPublisherDailyStats(yesterday);
      const closed = await this.repo.closeStaleSessions(30);
      this.logger.log(
        `Publisher rollup updated (${a + b} rows); closed ${closed} idle sessions`,
      );
    } catch (err) {
      this.logger.error(`Hourly rollup failed: ${(err as Error).message}`);
    }
  }

  /** Manual trigger used by the admin "rebuild" endpoint. */
  async rebuildRange(days = 30): Promise<{ days: number; rows: number }> {
    let rows = 0;
    for (let i = 0; i < days; i++) {
      const day = new Date(Date.now() - i * 86_400_000);
      rows += await this.repo.rebuildPublisherDailyStats(day);
    }
    return { days, rows };
  }
}
