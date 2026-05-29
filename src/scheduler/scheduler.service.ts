import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { ArticlesService } from '../articles/articles.service';
import { StoryClusteringService } from '../articles/clustering/story-clustering.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);
  private isRunning = false;

  constructor(
    private readonly articlesService: ArticlesService,
    private readonly clusteringService: StoryClusteringService,
    private readonly config: ConfigService,
  ) {}

  /**
   * On startup: run ingestion + cluster any articles that arrived while the
   * server was down (important on Render free tier which spins up on request).
   */
  async onModuleInit() {
    // Stagger slightly so other providers finish initialising first.
    await new Promise((r) => setTimeout(r, 3_000));

    this.logger.log('Startup ingestion triggered');
    try {
      const result = await this.articlesService.ingest();
      this.logger.log(
        `Startup ingestion done: processed=${result.processed}, saved=${result.saved}`,
      );
    } catch (err) {
      this.logger.warn(`Startup ingestion failed (non-fatal): ${(err as Error).message}`);
    }

    try {
      const result = await this.clusteringService.clusterUnassigned();
      if (result.scanned > 0) {
        this.logger.log(
          `Startup clustering: scanned=${result.scanned}, attached=${result.attached}, created=${result.created}`,
        );
      }
    } catch (err) {
      this.logger.warn(`Startup clustering failed (non-fatal): ${(err as Error).message}`);
    }
  }

  /** Ingest every 20 minutes while the server is alive. */
  @Cron('0 */20 * * * *')
  async handleScheduledIngestion() {
    if (this.isRunning) {
      this.logger.warn('Ingestion already in progress, skipping scheduled run');
      return;
    }

    this.isRunning = true;
    this.logger.log('Scheduled ingestion triggered');

    try {
      const result = await this.articlesService.ingest();
      this.logger.log(
        `Scheduled ingestion done: processed=${result.processed}, saved=${result.saved}, enqueued=${result.enqueued}`,
      );
    } catch (error) {
      this.logger.error(
        `Scheduled ingestion failed: ${(error as Error).message}`,
        (error as Error).stack,
      );
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Self-ping every 14 minutes to keep the Render free-tier dyno awake.
   * Render spins down after 15 minutes of inactivity — this prevents that.
   * Only runs when a PUBLIC_URL env var is set.
   */
  @Cron('0 */14 * * * *')
  async handleKeepAlive() {
    const publicUrl = this.config.get<string>('publicUrl') ?? process.env.PUBLIC_URL;
    if (!publicUrl) return;

    try {
      const url = `${publicUrl.replace(/\/$/, '')}/health`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      this.logger.debug(`Keep-alive ping → ${res.status}`);
    } catch {
      // Non-fatal — the server is clearly still running since this code is executing.
    }
  }
}
