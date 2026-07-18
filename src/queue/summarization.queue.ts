import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { InProcessQueue } from './in-process-queue';
import { SummarizationProcessor } from './summarization.processor';
import {
  SUMMARIZATION_QUEUE,
  SummarizeArticleJobData,
  SummarizeArticleJobResult,
} from './job-types';

@Injectable()
export class SummarizationQueueService {
  private readonly logger = new Logger(SummarizationQueueService.name);
  private readonly queue: InProcessQueue<
    SummarizeArticleJobData,
    SummarizeArticleJobResult
  >;

  constructor(
    processor: SummarizationProcessor,
    config: ConfigService,
  ) {
    this.queue = new InProcessQueue(
      SUMMARIZATION_QUEUE,
      (job) => processor.process(job),
      {
        concurrency: config.get<number>('queue.summarizationConcurrency') ?? 2,
        attempts: config.get<number>('queue.summarizationAttempts') ?? 5,
        backoffMs: config.get<number>('queue.summarizationBackoffMs') ?? 4_000,
        coalesceRerun: false,
      },
    );
  }

  /**
   * Idempotent enqueue. Re-using `articleId__field` as the jobId means a second
   * `ingest()` cycle won't double-queue the same article.
   */
  async enqueue(data: SummarizeArticleJobData): Promise<string> {
    const jobId = this.toJobId(data);
    this.queue.add(jobId, data);
    return jobId;
  }

  async enqueueBatch(jobs: SummarizeArticleJobData[]): Promise<number> {
    if (!jobs.length) return 0;
    this.queue.addBulk(
      jobs.map((data) => ({ jobId: this.toJobId(data), data })),
    );
    this.logger.log(`Enqueued ${jobs.length} summarization jobs`);
    return jobs.length;
  }

  /** Operational stats for admin endpoints. */
  async stats() {
    return { queue: SUMMARIZATION_QUEUE, ...this.queue.counts() };
  }

  private toJobId(data: SummarizeArticleJobData): string {
    return `${data.articleId}__${data.field}`;
  }
}
