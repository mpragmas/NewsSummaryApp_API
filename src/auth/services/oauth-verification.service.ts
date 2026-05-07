import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '../../generated/prisma';
import { createRemoteJWKSet, JWTPayload, jwtVerify } from 'jose';
import { createHash } from 'crypto';
import { OAuthAuthDto, OAuthProvider } from '../dto/oauth-auth.dto';
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

interface FacebookDebugResponse {
  data?: {
    app_id?: string;
    is_valid?: boolean;
    user_id?: string;
    expires_at?: number;
  };
}

interface FacebookProfileResponse {
  id?: string;
  name?: string;
  email?: string;
  picture?: { data?: { url?: string } };
}

@Injectable()
export class OAuthVerificationService {
  private readonly logger = new Logger(OAuthVerificationService.name);
  private readonly appleJwks = createRemoteJWKSet(
    new URL('https://appleid.apple.com/auth/keys'),
  );

  constructor(private readonly config: ConfigService) {}

  async verify(dto: OAuthAuthDto): Promise<VerifiedOAuthIdentity> {
    switch (dto.provider) {
      case OAuthProvider.GOOGLE:
        return this.verifyGoogle(dto.idToken);
      case OAuthProvider.FACEBOOK:
        return this.verifyFacebook(dto.accessToken);
      case OAuthProvider.APPLE:
        return this.verifyApple(dto.idToken, dto.nonce);
      default:
        throw new UnauthorizedException('Unsupported OAuth provider');
    }
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

  private async verifyFacebook(
    accessToken?: string,
  ): Promise<VerifiedOAuthIdentity> {
    if (!accessToken) {
      throw new UnauthorizedException('Facebook access token is required');
    }

    const appId = this.config.get<string>('oauth.facebookAppId')?.trim();
    const appSecret = this.config
      .get<string>('oauth.facebookAppSecret')
      ?.trim();
    if (!appId || !appSecret) {
      throw new UnauthorizedException('Facebook login is not configured');
    }

    const debug = await this.safeFetchJson<FacebookDebugResponse>(
      `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(`${appId}|${appSecret}`)}`,
      'Invalid Facebook token',
    );
    const debugData = debug.data;
    const isExpired =
      typeof debugData?.expires_at === 'number' &&
      debugData.expires_at * 1000 < Date.now();
    if (
      !debugData?.is_valid ||
      !debugData.user_id ||
      debugData.app_id !== appId ||
      isExpired
    ) {
      throw new UnauthorizedException('Invalid Facebook token');
    }

    const profile = await this.safeFetchJson<FacebookProfileResponse>(
      `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(accessToken)}`,
      'Unable to fetch Facebook profile',
    );
    if (!profile.id || profile.id !== debugData.user_id) {
      throw new UnauthorizedException('Invalid Facebook token');
    }

    return {
      provider: AuthProvider.facebook,
      providerAccountId: profile.id,
      email: profile.email ?? null,
      emailVerified: Boolean(profile.email),
      name: profile.name ?? null,
      picture: profile.picture?.data?.url ?? null,
    };
  }

  private async verifyApple(
    idToken?: string,
    nonce?: string,
  ): Promise<VerifiedOAuthIdentity> {
    if (!idToken) {
      throw new UnauthorizedException('Apple id_token is required');
    }
    const allowedAudiences = this.getCsvConfig('oauth.appleClientIds');
    if (!allowedAudiences.length) {
      throw new UnauthorizedException('Apple sign-in is not configured');
    }

    let payload: JWTPayload;
    try {
      const result = await jwtVerify(idToken, this.appleJwks, {
        issuer: 'https://appleid.apple.com',
        audience: allowedAudiences,
      });
      payload = result.payload;
    } catch (error) {
      this.logger.warn(`Apple token verification failed: ${(error as Error).message}`);
      throw new UnauthorizedException('Invalid or expired Apple token');
    }

    if (!payload.sub || typeof payload.sub !== 'string') {
      throw new UnauthorizedException('Invalid or expired Apple token');
    }

    if (nonce) {
      const expectedNonce = createHash('sha256').update(nonce).digest('base64url');
      if (payload.nonce !== expectedNonce) {
        throw new UnauthorizedException('Invalid or expired Apple token');
      }
    }

    const email = typeof payload.email === 'string' ? payload.email : null;
    const emailVerified = payload.email_verified === true || payload.email_verified === 'true';

    return {
      provider: AuthProvider.apple,
      providerAccountId: payload.sub,
      email,
      emailVerified,
      name: null,
      picture: null,
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
