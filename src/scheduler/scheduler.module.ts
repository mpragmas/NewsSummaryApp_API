import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [ArticlesModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
