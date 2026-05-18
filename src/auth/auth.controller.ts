import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuthAuthDto } from './dto/oauth-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Verify OAuth provider tokens and return a signed API JWT. */
  @Post('oauth')
  @HttpCode(HttpStatus.OK)
  loginOAuth(@Body() dto: OAuthAuthDto) {
    return this.authService.loginWithOAuth(dto);
  }
}
