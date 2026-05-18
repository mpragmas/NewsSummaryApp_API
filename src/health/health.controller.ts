import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Service health check' })
  async check() {
    let dbStatus: 'ok' | 'error' = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }

    const overall = dbStatus === 'ok' ? 'ok' : 'degraded';
    return {
      status: overall,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      services: { database: dbStatus },
    };
  }
}
