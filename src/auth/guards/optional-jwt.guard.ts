import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Soft JWT guard: sets req.user when a valid token is present,
 * but lets unauthenticated requests through (req.user will be undefined).
 */
@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Never throw — swallow auth errors so guests are allowed through
  handleRequest<T>(_err: unknown, user: T): T {
    return user;
  }
}
