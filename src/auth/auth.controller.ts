import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthDto } from './dto/firebase-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Verify a Firebase ID token from the client SDK and return a JWT (creates user if new). */
  @Post('firebase')
  @HttpCode(HttpStatus.OK)
  loginFirebase(@Body() dto: FirebaseAuthDto) {
    return this.authService.loginWithFirebase(dto);
  }
}
