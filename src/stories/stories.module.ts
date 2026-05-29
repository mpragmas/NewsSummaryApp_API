import { Module, forwardRef } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { QueueModule } from '../queue/queue.module';
import { AdminApiKeyGuard } from '../common/guards/admin-api-key.guard';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UsersModule),
    AuthModule,
    QueueModule,
  ],
  controllers: [StoriesController],
  providers: [StoriesService, AdminApiKeyGuard],
  exports: [StoriesService],
})
export class StoriesModule {}
