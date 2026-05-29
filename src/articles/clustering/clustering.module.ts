import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { StoryClusteringService } from './story-clustering.service';

/**
 * Self-contained story-clustering engine. Depends only on Prisma so it can be
 * imported by the queue worker without creating a cycle with ArticlesModule.
 */
@Module({
  imports: [PrismaModule],
  providers: [StoryClusteringService],
  exports: [StoryClusteringService],
})
export class ClusteringModule {}
