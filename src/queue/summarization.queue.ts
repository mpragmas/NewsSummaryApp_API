import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import {
  SUMMARIZATION_QUEUE,
  SummarizeArticleJobData,
} from './job-types';

@Injectable()
export class SummarizationQueueService {
  private readonly logger = new Logger(SummarizationQueueService.name);

  constructor(
    @InjectQueue(SUMMARIZATION_QUEUE)
    private readonly queue: Queue<SummarizeArticleJobData>,
  ) {}

  /**
   * Idempotent enqueue. Re-using `articleId:field` as the BullMQ jobId means
   * a second `ingest()` cycle won't double-queue the same article.
   */
  async enqueue(data: SummarizeArticleJobData): Promise<string> {
    const jobId = `${data.articleId}:${data.field}`;
    await this.queue.add('summarize', data, {
      jobId,
      removeOnComplete: { count: 1_000, age: 24 * 60 * 60 },
      removeOnFail: { count: 5_000, age: 7 * 24 * 60 * 60 },
    });
    return jobId;
  }

  async enqueueBatch(jobs: SummarizeArticleJobData[]): Promise<number> {
    if (!jobs.length) return 0;

    await this.queue.addBulk(
      jobs.map((data) => ({
        name: 'summarize',
        data,
        opts: {
          jobId: `${data.articleId}:${data.field}`,
          removeOnComplete: { count: 1_000, age: 24 * 60 * 60 },
          removeOnFail: { count: 5_000, age: 7 * 24 * 60 * 60 },
        },
      })),
    );
    this.logger.log(`Enqueued ${jobs.length} summarization jobs`);
    return jobs.length;
  }

  /** Operational stats for admin endpoints. */
  async stats() {
    const counts = await this.queue.getJobCounts(
      'wait',
      'active',
      'delayed',
      'failed',
      'completed',
    );
    return { queue: SUMMARIZATION_QUEUE, ...counts };
  }
}
