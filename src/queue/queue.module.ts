import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SUMMARIZATION_QUEUE } from './job-types';
import { SummarizationProcessor } from './summarization.processor';
import { SummarizationQueueService } from './summarization.queue';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host') ?? 'localhost',
          port: config.get<number>('redis.port') ?? 6379,
          password: config.get<string>('redis.password'),
          db: config.get<number>('redis.db') ?? 0,
          // Required by BullMQ on shared Redis instances.
          maxRetriesPerRequest: null,
        },
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
            delay:
              config.get<number>('queue.summarizationBackoffMs') ?? 4_000,
          },
          removeOnComplete: { count: 1_000, age: 24 * 60 * 60 },
          removeOnFail: { count: 5_000, age: 7 * 24 * 60 * 60 },
        },
      }),
    }),
    AiModule,
    PrismaModule,
  ],
  providers: [SummarizationQueueService, SummarizationProcessor],
  exports: [SummarizationQueueService],
})
export class QueueModule {}
