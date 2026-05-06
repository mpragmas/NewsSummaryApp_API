import { Module, forwardRef } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CategorizerService } from './categorizer.service';
import { DeduplicationService } from './deduplication.service';
import { RssModule } from '../rss/rss.module';
import { AiModule } from '../ai/ai.module';
import { ScraperModule } from '../scrapers/scraper.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { GuestModule } from '../guest/guest.module';
import { AdminApiKeyGuard } from '../common/guards/admin-api-key.guard';

@Module({
  imports: [
    RssModule,
    AiModule,
    ScraperModule,
    forwardRef(() => UsersModule),
    AuthModule,
    GuestModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, CategorizerService, DeduplicationService, AdminApiKeyGuard],
  exports: [ArticlesService],
})
export class ArticlesModule {}
