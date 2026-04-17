import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private isRunning = false;

  constructor(private readonly articlesService: ArticlesService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleScheduledIngestion() {
    if (this.isRunning) {
      this.logger.warn('Ingestion already in progress, skipping scheduled run');
      return;
    }

    this.isRunning = true;
    this.logger.log('Scheduled ingestion triggered');

    try {
      const result = await this.articlesService.ingest();
      this.logger.log(`Scheduled ingestion done: processed=${result.processed}, saved=${result.saved}`);
    } catch (error) {
      this.logger.error(`Scheduled ingestion failed: ${(error as Error).message}`, (error as Error).stack);
    } finally {
      this.isRunning = false;
    }
  }
}
