import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AnalyticsController } from './analytics.controller';
import { RedirectController } from './redirect.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsAggregationService } from './analytics-aggregation.service';
import { AdminApiKeyGuard } from '../common/guards/admin-api-key.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AnalyticsController, RedirectController],
  providers: [
    AnalyticsService,
    AnalyticsRepository,
    AnalyticsAggregationService,
    AdminApiKeyGuard,
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
