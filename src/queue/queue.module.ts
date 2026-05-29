import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ClusteringModule } from '../articles/clustering/clustering.module';
import { getRedisConnectionOptions } from '../config/redis-connection';
import { CLUSTERING_QUEUE, SUMMARIZATION_QUEUE } from './job-types';
import { SummarizationProcessor } from './summarization.processor';
import { SummarizationQueueService } from './summarization.queue';
import { ClusteringProcessor } from './clustering.processor';
import { ClusteringQueueService } from './clustering.queue';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: getRedisConnectionOptions(config),
      }),
    }),
    BullModule.registerQueueAsync({
      name: SUMMARIZATION_QUEUE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        defaultJobOptions: {
          attempts: config.get<number>('queue.summarizationAttempts') ?? 5,
          backoff: {
            type: 'exponential',
            delay: config.get<number>('queue.summarizationBackoffMs') ?? 4_000,
          },
          removeOnComplete: { count: 1_000, age: 24 * 60 * 60 },
          removeOnFail: { count: 5_000, age: 7 * 24 * 60 * 60 },
        },
      }),
    }),
    BullModule.registerQueue({
      name: CLUSTERING_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5_000 },
        removeOnComplete: { count: 200, age: 24 * 60 * 60 },
        removeOnFail: { count: 1_000, age: 7 * 24 * 60 * 60 },
      },
    }),
    AiModule,
    PrismaModule,
    ClusteringModule,
  ],
  providers: [
    SummarizationQueueService,
    SummarizationProcessor,
    ClusteringQueueService,
    ClusteringProcessor,
  ],
  exports: [SummarizationQueueService, ClusteringQueueService],
})
export class QueueModule {}
