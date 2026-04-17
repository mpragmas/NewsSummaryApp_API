import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CategorizerService } from './categorizer.service';
import { DeduplicationService } from './deduplication.service';
import { RssModule } from '../rss/rss.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [RssModule, AiModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, CategorizerService, DeduplicationService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
