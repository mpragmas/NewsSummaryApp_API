import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleOAuthDto } from './dto/google-oauth.dto';
import { AppleOAuthDto } from './dto/apple-oauth.dto';
import { FacebookOAuthDto } from './dto/facebook-oauth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /** Verify a Google ID token from the client SDK and return a JWT (creates user if new). */
  @Post('oauth/google')
  @HttpCode(HttpStatus.OK)
  loginGoogle(@Body() dto: GoogleOAuthDto) {
    return this.authService.loginWithGoogle(dto);
  }

  /** Verify an Apple identity token and return a JWT (creates user if new). */
  @Post('oauth/apple')
  @HttpCode(HttpStatus.OK)
  loginApple(@Body() dto: AppleOAuthDto) {
    return this.authService.loginWithApple(dto);
  }

  /** Verify a Facebook user access token and return a JWT (creates user if new). */
  @Post('oauth/facebook')
  @HttpCode(HttpStatus.OK)
  loginFacebook(@Body() dto: FacebookOAuthDto) {
    return this.authService.loginWithFacebook(dto);
  }
}
