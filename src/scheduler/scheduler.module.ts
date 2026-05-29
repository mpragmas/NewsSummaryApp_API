import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SchedulerService } from './scheduler.service';
import { ArticlesModule } from '../articles/articles.module';
import { ClusteringModule } from '../articles/clustering/clustering.module';

@Module({
  imports: [ArticlesModule, ClusteringModule, ConfigModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
