import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

export interface OAuthProfile {
  providerUserId: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}

interface FacebookMeResponse {
  id: string;
  name?: string;
  email?: string;
  picture?: { data?: { url?: string } };
}

interface FacebookDebugTokenResponse {
  data?: { app_id?: string; is_valid?: boolean; user_id?: string };
}

@Injectable()
export class OAuthVerificationService {
  private readonly logger = new Logger(OAuthVerificationService.name);
  private readonly googleClient = new OAuth2Client();
  private readonly appleJwks = jwksRsa({
    jwksUri: 'https://appleid.apple.com/auth/keys',
    cache: true,
    rateLimit: true,
  });

  constructor(private readonly config: ConfigService) {}

  async verifyGoogleIdToken(idToken: string): Promise<OAuthProfile> {
    const audiences = this.config.get<string[]>('oauth.google.clientIds') ?? [];
    if (!audiences.length) {
      throw new BadRequestException(
        'Google sign-in is not configured (set GOOGLE_CLIENT_IDS)',
      );
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: audiences,
      });
      const p = ticket.getPayload();
      if (!p?.sub) throw new UnauthorizedException('Invalid Google token');
      return {
        providerUserId: p.sub,
        email: p.email ?? null,
        name: p.name ?? null,
        avatarUrl: p.picture ?? null,
      };
    } catch (err) {
      this.logger.warn(`Google token verification failed: ${(err as Error).message}`);
      throw new UnauthorizedException('Invalid or expired Google token');
    }
  }

  async verifyAppleIdToken(idToken: string): Promise<OAuthProfile> {
    const audiences = this.config.get<string[]>('oauth.apple.clientIds') ?? [];
    if (!audiences.length) {
      throw new BadRequestException(
        'Apple sign-in is not configured (set APPLE_CLIENT_IDS)',
      );
    }

    const decoded = jwt.decode(idToken, { complete: true });
    if (!decoded || typeof decoded === 'string' || !decoded.header?.kid) {
      throw new UnauthorizedException('Invalid Apple token');
    }

    try {
      const key = await this.appleJwks.getSigningKey(decoded.header.kid);
      const pubKey = key.getPublicKey();
      const payload = jwt.verify(idToken, pubKey, {
        algorithms: ['RS256'],
        audience: audiences as [string, ...string[]],
        issuer: 'https://appleid.apple.com',
      }) as jwt.JwtPayload;

      if (!payload.sub) throw new UnauthorizedException('Invalid Apple token');

      return {
        providerUserId: payload.sub,
        email: typeof payload.email === 'string' ? payload.email : null,
        name: null,
        avatarUrl: null,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      this.logger.warn(`Apple token verification failed: ${(err as Error).message}`);
      throw new UnauthorizedException('Invalid or expired Apple token');
    }
  }

  async verifyFacebookAccessToken(accessToken: string): Promise<OAuthProfile> {
    const appId = this.config.get<string>('oauth.facebook.appId') ?? '';
    const appSecret = this.config.get<string>('oauth.facebook.appSecret') ?? '';
    if (!appId || !appSecret) {
      throw new BadRequestException(
        'Facebook login is not configured (set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET)',
      );
    }

    const debugUrl =
      `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}` +
      `&access_token=${encodeURIComponent(`${appId}|${appSecret}`)}`;

    const debugRes = await fetch(debugUrl);
    if (!debugRes.ok) {
      this.logger.warn(`Facebook debug_token HTTP ${debugRes.status}`);
      throw new UnauthorizedException('Invalid Facebook token');
    }

    const debugJson = (await debugRes.json()) as FacebookDebugTokenResponse;
    const data = debugJson.data;
    if (!data?.is_valid || data.app_id !== appId) {
      throw new UnauthorizedException('Invalid Facebook token for this app');
    }

    const userId = data.user_id;
    if (!userId) throw new UnauthorizedException('Invalid Facebook token');

    const fields = 'id,name,email,picture.type(large)';
    const meUrl =
      `https://graph.facebook.com/me?fields=${encodeURIComponent(fields)}` +
      `&access_token=${encodeURIComponent(accessToken)}`;

    const meRes = await fetch(meUrl);
    if (!meRes.ok) {
      this.logger.warn(`Facebook /me HTTP ${meRes.status}`);
      throw new UnauthorizedException('Could not load Facebook profile');
    }

    const me = (await meRes.json()) as FacebookMeResponse;
    if (!me.id) throw new UnauthorizedException('Invalid Facebook profile');

    const avatarUrl = me.picture?.data?.url ?? null;

    return {
      providerUserId: me.id,
      email: me.email ?? null,
      name: me.name ?? null,
      avatarUrl,
    };
  }
}
