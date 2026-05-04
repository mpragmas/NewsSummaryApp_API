import { Module, forwardRef } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CategorizerService } from './categorizer.service';
import { DeduplicationService } from './deduplication.service';
import { RssModule } from '../rss/rss.module';
import { AiModule } from '../ai/ai.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { GuestModule } from '../guest/guest.module';

@Module({
  imports: [
    RssModule,
    AiModule,
    forwardRef(() => UsersModule),
    AuthModule,
    GuestModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, CategorizerService, DeduplicationService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
