import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { GuestService } from '../guest/guest.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../generated/prisma';
import { OAuthAuthDto } from './dto/oauth-auth.dto';
import { CredentialsLoginDto } from './dto/credentials-login.dto';
import { OAuthVerificationService } from './services/oauth-verification.service';
import { PrismaOAuthAdapterService } from './services/prisma-oauth-adapter.service';

export interface AuthTokenResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    preferredAppLanguage: string;
    preferredNewsLanguage: string;
  };
  guestMerge?: { mergedSaves: number; mergedReads: number };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly guestService: GuestService,
    private readonly oauthVerification: OAuthVerificationService,
    private readonly prismaOAuthAdapter: PrismaOAuthAdapterService,
  ) {}

  /** Regular-user sign-in. Google accounts are never granted the admin role here. */
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

  /**
   * Admin-only username/password sign-in. There is no signup counterpart —
   * admin accounts are pre-provisioned (seeded) and never created here. Only
   * accounts that already carry the admin role and a password hash can use it.
   */
  async loginWithCredentials(dto: CredentialsLoginDto): Promise<AuthTokenResponse> {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username.trim() },
    });

    if (!user || !user.passwordHash || user.role !== Role.admin) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const matches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid username or password');
    }

    this.logger.log(`Admin credentials sign-in for user ${user.id}`);
    return this.buildTokenResponse(user);
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
    role: Role;
    preferredAppLanguage: string;
    preferredNewsLanguage: string;
  }): AuthTokenResponse {
    const accessToken = this.jwt.sign({
      sub: user.id,
      email: user.email ?? '',
      role: user.role,
    });
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email ?? '',
        name: user.name,
        role: user.role,
        preferredAppLanguage: user.preferredAppLanguage,
        preferredNewsLanguage: user.preferredNewsLanguage,
      },
    };
  }
}
