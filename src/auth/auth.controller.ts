import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { OAuthAuthDto } from './dto/oauth-auth.dto';
import { CredentialsLoginDto } from './dto/credentials-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Verify OAuth provider tokens and return a signed API JWT. */
  @Post('oauth')
  @HttpCode(HttpStatus.OK)
  loginOAuth(@Body() dto: OAuthAuthDto) {
    return this.authService.loginWithOAuth(dto);
  }

  /**
   * Admin-only username/password sign-in. No signup endpoint exists —
   * admin accounts are pre-provisioned (seeded) only. Throttled to slow
   * down credential-stuffing attempts.
   */
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  loginWithCredentials(@Body() dto: CredentialsLoginDto) {
    return this.authService.loginWithCredentials(dto);
  }
}
