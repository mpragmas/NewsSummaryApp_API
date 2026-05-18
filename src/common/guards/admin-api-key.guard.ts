import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

/**
 * Protects maintenance / ingestion endpoints. Set ADMIN_API_KEY in the server env
 * and send it as header `X-Admin-Key`. If unset, these routes are disabled.
 */
@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.config.get<string>('admin.apiKey')?.trim();
    if (!expected) {
      throw new ForbiddenException('Server administration is not configured');
    }
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers['x-admin-key'];
    const key = Array.isArray(header) ? header[0] : header;
    if (!key || key !== expected) {
      throw new UnauthorizedException('Invalid or missing admin key');
    }
    return true;
  }
}
