import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { Cacheable, CacheableMemory } from 'cacheable';

import configuration from './config/configuration';
import { describeRedisTarget, getRedisKeyvUri } from './config/redis-connection';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { RssModule } from './rss/rss.module';
import { AiModule } from './ai/ai.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QueueModule } from './queue/queue.module';
import { HealthModule } from './health/health.module';
import { GuestModule } from './guest/guest.module';

const cacheLogger = new Logger('CacheModule');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: (config.get<number>('throttle.ttl') ?? 60) * 1000,
          limit: config.get<number>('throttle.limit') ?? 100,
        },
      ],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const ttl = (config.get<number>('redis.ttl') ?? 1800) * 1000;
        const primary = new CacheableMemory({ ttl, lruSize: 5000 });

        // Try to attach Redis as a secondary tier; fall back gracefully if unavailable
        let secondary: unknown = undefined;
        try {
          const { createKeyv } = await import('@keyv/redis');
          const redisUri = getRedisKeyvUri(config);

          const redisStore = createKeyv(redisUri, {
            connectionTimeout: 3000,
            throwOnConnectError: false,
            throwOnErrors: false,
          });

          redisStore.on?.('error', (err: Error) =>
            cacheLogger.warn(`Redis error — operating with memory cache only: ${err.message}`),
          );

          secondary = redisStore;
          cacheLogger.log(
            `Redis secondary cache: ${describeRedisTarget(config)}`,
          );
        } catch (err) {
          cacheLogger.warn(`Redis unavailable, memory-only cache active: ${(err as Error).message}`);
        }

        // Cacheable passes the isCacheable() guard in @nestjs/cache-manager
        // and is returned directly, bypassing the broken instanceof Keyv check
        const cacheableOptions: Record<string, unknown> = {
          primary,
          nonBlocking: true,
        };
        if (secondary) cacheableOptions.secondary = secondary;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const store = new Cacheable(cacheableOptions as any);

        return { stores: store, ttl };
      },
    }),
    PrismaModule,
    RssModule,
    AiModule,
    QueueModule,
    ArticlesModule,
    SchedulerModule,
    AuthModule,
    UsersModule,
    GuestModule,
    HealthModule,
  ],
})
export class AppModule {}
