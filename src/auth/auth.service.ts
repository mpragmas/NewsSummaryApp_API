import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GuestService } from '../guest/guest.service';
import { OAuthAuthDto } from './dto/oauth-auth.dto';
import { OAuthVerificationService } from './services/oauth-verification.service';
import { PrismaOAuthAdapterService } from './services/prisma-oauth-adapter.service';

export interface AuthTokenResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    preferredLanguage: string;
  };
  guestMerge?: { mergedSaves: number; mergedReads: number };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly guestService: GuestService,
    private readonly oauthVerification: OAuthVerificationService,
    private readonly prismaOAuthAdapter: PrismaOAuthAdapterService,
  ) {}

  async loginWithOAuth(dto: OAuthAuthDto): Promise<AuthTokenResponse> {
    const identity = await this.oauthVerification.verify(dto);
    const user = await this.prismaOAuthAdapter.getOrCreateUser(identity);

    const guestMerge = await this.maybeMergeGuest(
      user.id,
      dto.mergeFromGuestSessionId,
    );
    const tokenResponse = this.buildTokenResponse(user);
    this.logger.log(`OAuth sign-in (${identity.provider}) for user ${user.id}`);
    return guestMerge ? { ...tokenResponse, guestMerge } : tokenResponse;
  }

  private async maybeMergeGuest(
    userId: string,
    mergeFromGuestSessionId?: string,
  ): Promise<{ mergedSaves: number; mergedReads: number } | undefined> {
    if (!mergeFromGuestSessionId) return undefined;
    try {
      return await this.guestService.mergeGuestSessionIntoUser(
        mergeFromGuestSessionId,
        userId,
      );
    } catch (err) {
      this.logger.warn(
        `Guest merge skipped for ${userId}: ${(err as Error).message}`,
      );
      return undefined;
    }
  }

  private buildTokenResponse(user: {
    id: string;
    email: string | null;
    name: string | null;
    preferredLanguage: string;
  }): AuthTokenResponse {
    const accessToken = this.jwt.sign({
      sub: user.id,
      email: user.email ?? '',
    });
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email ?? '',
        name: user.name,
        preferredLanguage: user.preferredLanguage,
      },
    };
  }
}
