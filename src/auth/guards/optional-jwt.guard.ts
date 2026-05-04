import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthUser, JwtPayload } from '../strategies/jwt.strategy';

/**
 * Sets req.user when a valid Bearer token is present; otherwise leaves the
 * request unauthenticated. Invalid/expired tokens are ignored (guest access).
 */
@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ headers?: { authorization?: string }; user?: AuthUser }>();
    const authHeader = req.headers?.authorization;
    const token =
      authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;

    if (!token) {
      req.user = undefined;
      return true;
    }

    try {
      const secret = this.config.get<string>('jwt.secret') ?? 'changeme-in-production';
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, { secret });
      req.user = { userId: payload.sub, email: payload.email };
    } catch {
      req.user = undefined;
    }

    return true;
  }
}
