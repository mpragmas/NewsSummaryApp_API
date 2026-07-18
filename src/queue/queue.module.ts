import { Module } from '@nestjs/common';

import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ClusteringModule } from '../articles/clustering/clustering.module';
import { SummarizationProcessor } from './summarization.processor';
import { SummarizationQueueService } from './summarization.queue';
import { ClusteringProcessor } from './clustering.processor';
import { ClusteringQueueService } from './clustering.queue';

/**
 * Background job processing.
 *
 * Jobs run on a lightweight in-process queue (see InProcessQueue) — no Redis.
 * This removes the always-on BullMQ workers that were polling Upstash and
 * draining its per-command quota, which took the API down. Since the app runs
 * as a single Render web service, an in-process queue loses nothing
 * operationally; the scheduled reconciliation pass re-enqueues any article that
 * a restart left without a summary.
 */
@Module({
  imports: [AiModule, PrismaModule, ClusteringModule],
  providers: [
    SummarizationProcessor,
    SummarizationQueueService,
    ClusteringProcessor,
    ClusteringQueueService,
  ],
  exports: [SummarizationQueueService, ClusteringQueueService],
})
export class QueueModule {}
