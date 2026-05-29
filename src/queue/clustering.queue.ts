import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { CLUSTERING_QUEUE, ClusterRecentJobData } from './job-types';

@Injectable()
export class ClusteringQueueService {
  private readonly logger = new Logger(ClusteringQueueService.name);

  constructor(
    @InjectQueue(CLUSTERING_QUEUE)
    private readonly queue: Queue<ClusterRecentJobData>,
  ) {}

  /**
   * Enqueue a clustering pass. Incremental runs are coalesced under a single
   * jobId so a burst of ingests doesn't pile up redundant passes; a rebuild is
   * always its own job.
   */
  async enqueueClusterRecent(data: ClusterRecentJobData): Promise<string> {
    const jobId = data.rebuild
      ? `cluster-rebuild-${Date.now()}`
      : 'cluster-recent';
    await this.queue.add('cluster', data, {
      jobId,
      removeOnComplete: { count: 200, age: 24 * 60 * 60 },
      removeOnFail: { count: 1_000, age: 7 * 24 * 60 * 60 },
    });
    this.logger.log(
      `Enqueued clustering job (${data.trigger}, rebuild=${!!data.rebuild})`,
    );
    return jobId;
  }

  async stats() {
    const counts = await this.queue.getJobCounts(
      'wait',
      'active',
      'delayed',
      'failed',
      'completed',
    );
    return { queue: CLUSTERING_QUEUE, ...counts };
  }
}
