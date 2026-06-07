import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AuthUser, JwtPayload } from '../../auth/strategies/jwt.strategy';
import { Role } from '../../generated/prisma';

interface AdminRequest extends Request {
  user?: AuthUser;
}

/**
 * Grants access to admin dashboards via EITHER:
 *   1. the static `X-Admin-Key` header (machine / break-glass access), or
 *   2. a Bearer JWT whose user holds the `admin` role (credentials sign-in).
 *
 * Admin accounts are pre-provisioned (seeded) with the `admin` role and a
 * username/password — there is no self-signup or Google-based promotion path.
 */
@Injectable()
export class AdminAccessGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AdminRequest>();

    if (this.hasValidAdminKey(req)) return true;
    if (await this.hasAdminJwt(req)) return true;

    throw new UnauthorizedException('Admin access required');
  }

  private hasValidAdminKey(req: AdminRequest): boolean {
    const expected = this.config.get<string>('admin.apiKey')?.trim();
    if (!expected) return false;
    const header = req.headers['x-admin-key'];
    const key = Array.isArray(header) ? header[0] : header;
    return !!key && key === expected;
  }

  private async hasAdminJwt(req: AdminRequest): Promise<boolean> {
    const auth = req.headers.authorization;
    const token = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : undefined;
    if (!token) return false;
    try {
      const secret =
        this.config.get<string>('jwt.secret') ?? 'changeme-in-production';
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, { secret });
      if (payload.role !== Role.admin) return false;
      req.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      return true;
    } catch {
      return false;
    }
  }
}
