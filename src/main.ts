import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { describeRedisTarget } from './config/redis-connection';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error', 'debug'],
  });

  const corsOrigin = process.env.CORS_ORIGIN?.trim();
  const origin =
    !corsOrigin || corsOrigin === '*'
      ? true
      : corsOrigin.split(',').map((o) => o.trim()).filter(Boolean);

  app.enableCors({
    origin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Guest-Session-Id',
      'X-Admin-Key',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.setGlobalPrefix('api/v1', {
    exclude: ['health'],
  });

  // Swagger — disabled in production unless SWAGGER_ENABLED=true
  if (process.env.NODE_ENV !== 'production' || process.env.SWAGGER_ENABLED === 'true') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('NewsSummary API')
      .setDescription('Multilingual news aggregation and AI summarization API')
      .setVersion('1.0')
      .addBearerAuth()
      .addApiKey({ type: 'apiKey', name: 'X-Admin-Key', in: 'header' }, 'admin-key')
      .addApiKey({ type: 'apiKey', name: 'X-Guest-Session-Id', in: 'header' }, 'guest-session')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    logger.log('Swagger docs available at /api/docs');
  }

  const config = app.get(ConfigService);
  const port = config.get<number>('port') ?? 3000;
  const host = process.env.HOST ?? '0.0.0.0';

  logger.log(`Redis target: ${describeRedisTarget(config)}`);

  await app.listen(port, host);
  logger.log(`Application running on http://localhost:${port}/api/v1`);
  logger.log(`Health check: http://localhost:${port}/health`);
}

bootstrap();
