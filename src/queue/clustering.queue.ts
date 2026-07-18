import { Injectable, Logger } from '@nestjs/common';

import { InProcessQueue } from './in-process-queue';
import { ClusteringProcessor } from './clustering.processor';
import {
  CLUSTERING_QUEUE,
  ClusterRecentJobData,
  ClusterRecentJobResult,
} from './job-types';

@Injectable()
export class ClusteringQueueService {
  private readonly logger = new Logger(ClusteringQueueService.name);
  private readonly queue: InProcessQueue<
    ClusterRecentJobData,
    ClusterRecentJobResult
  >;

  constructor(processor: ClusteringProcessor) {
    this.queue = new InProcessQueue(
      CLUSTERING_QUEUE,
      (job) => processor.process(job),
      {
        concurrency: 1,
        attempts: 3,
        backoffMs: 5_000,
        // A burst of ingests while a pass is running still ends with a fresh
        // pass over the newly-arrived articles.
        coalesceRerun: true,
      },
    );
  }

  /**
   * Enqueue a clustering pass. Incremental runs are coalesced under a single
   * jobId so a burst of ingests doesn't pile up redundant passes; a rebuild is
   * always its own job.
   */
  async enqueueClusterRecent(data: ClusterRecentJobData): Promise<string> {
    const jobId = data.rebuild
      ? `cluster-rebuild-${Date.now()}`
      : 'cluster-recent';
    this.queue.add(jobId, data);
    this.logger.log(
      `Enqueued clustering job (${data.trigger}, rebuild=${!!data.rebuild})`,
    );
    return jobId;
  }

  async stats() {
    return { queue: CLUSTERING_QUEUE, ...this.queue.counts() };
  }
}
