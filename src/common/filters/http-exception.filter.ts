import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/** Makes Nest validation / HttpException bodies JSON-safe and readable for API clients. */
function flattenHttpMessage(body: string | Record<string, unknown>): string | string[] {
  if (typeof body === 'string') return body;
  const msg = body.message;
  if (typeof msg === 'string') return msg;
  if (Array.isArray(msg)) return msg.filter((m): m is string => typeof m === 'string');
  return typeof body.error === 'string' ? body.error : 'Request failed';
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const message =
      typeof rawMessage === 'object' && rawMessage !== null && !Array.isArray(rawMessage)
        ? flattenHttpMessage(rawMessage as Record<string, unknown>)
        : rawMessage;

    this.logger.error(`${request.method} ${request.url} - ${status}`, exception instanceof Error ? exception.stack : String(exception));

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
