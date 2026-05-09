import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '../../generated/prisma';
import { OAuthAuthDto } from '../dto/oauth-auth.dto';
import { VerifiedOAuthIdentity } from './prisma-oauth-adapter.service';

interface GoogleTokenInfoResponse {
  sub?: string;
  email?: string;
  email_verified?: string;
  name?: string;
  picture?: string;
  aud?: string;
  iss?: string;
}

@Injectable()
export class OAuthVerificationService {
  private readonly logger = new Logger(OAuthVerificationService.name);

  constructor(private readonly config: ConfigService) {}

  async verify(dto: OAuthAuthDto): Promise<VerifiedOAuthIdentity> {
    return this.verifyGoogle(dto.idToken);
  }

  private async verifyGoogle(idToken?: string): Promise<VerifiedOAuthIdentity> {
    if (!idToken) {
      throw new UnauthorizedException('Google id_token is required');
    }
    const allowedAudiences = this.getCsvConfig('oauth.googleClientIds');
    if (!allowedAudiences.length) {
      throw new UnauthorizedException('Google sign-in is not configured');
    }

    const tokenInfo = await this.safeFetchJson<GoogleTokenInfoResponse>(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
      'Invalid or expired Google token',
    );

    if (!tokenInfo.sub || !tokenInfo.aud || !tokenInfo.iss) {
      throw new UnauthorizedException('Invalid or expired Google token');
    }
    if (!allowedAudiences.includes(tokenInfo.aud)) {
      throw new UnauthorizedException('Invalid or expired Google token');
    }
    if (
      tokenInfo.iss !== 'https://accounts.google.com' &&
      tokenInfo.iss !== 'accounts.google.com'
    ) {
      throw new UnauthorizedException('Invalid or expired Google token');
    }

    return {
      provider: AuthProvider.google,
      providerAccountId: tokenInfo.sub,
      email: tokenInfo.email ?? null,
      emailVerified: tokenInfo.email_verified === 'true',
      name: tokenInfo.name ?? null,
      picture: tokenInfo.picture ?? null,
    };
  }

  private getCsvConfig(path: string): string[] {
    const raw = this.config.get<string>(path) ?? '';
    return raw
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  }

  private async safeFetchJson<T>(url: string, fallback: string): Promise<T> {
    let response: Response;
    try {
      response = await fetch(url);
    } catch (error) {
      this.logger.warn(`OAuth verification request failed: ${(error as Error).message}`);
      throw new UnauthorizedException(fallback);
    }
    if (!response.ok) {
      throw new UnauthorizedException(fallback);
    }
    return (await response.json()) as T;
  }
}
