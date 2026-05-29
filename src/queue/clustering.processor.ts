import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { StoryClusteringService } from '../articles/clustering/story-clustering.service';
import {
  CLUSTERING_QUEUE,
  ClusterRecentJobData,
  ClusterRecentJobResult,
} from './job-types';

/**
 * BullMQ worker for story clustering.
 *
 * Concurrency is fixed at 1: clustering reads then writes shared cluster rows,
 * so running passes sequentially guarantees two articles of the same event
 * never race to create duplicate clusters. Clustering is pure lexical work
 * (no AI), so a single worker is plenty fast.
 */
@Processor(CLUSTERING_QUEUE, {
  concurrency: 1,
  lockDuration: 600_000,
})
export class ClusteringProcessor extends WorkerHost {
  private readonly logger = new Logger(ClusteringProcessor.name);

  constructor(private readonly clustering: StoryClusteringService) {
    super();
  }

  async process(
    job: Job<ClusterRecentJobData, ClusterRecentJobResult>,
  ): Promise<ClusterRecentJobResult> {
    const { trigger, rebuild } = job.data;
    this.logger.log(
      `Clustering job=${job.id} trigger=${trigger} rebuild=${!!rebuild}`,
    );

    const result = rebuild
      ? await this.clustering.rebuildAll()
      : await this.clustering.clusterUnassigned();

    this.logger.log(
      `Clustering job=${job.id} done: scanned=${result.scanned}, attached=${result.attached}, created=${result.created}, ${result.durationMs}ms`,
    );
    return result;
  }
}
