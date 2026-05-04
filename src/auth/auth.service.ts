import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuthProvider } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GuestService } from '../guest/guest.service';
import { OAuthVerificationService, OAuthProfile } from './services/oauth-verification.service';
import { GoogleOAuthDto } from './dto/google-oauth.dto';
import { AppleOAuthDto } from './dto/apple-oauth.dto';
import { FacebookOAuthDto } from './dto/facebook-oauth.dto';

const BCRYPT_ROUNDS = 12;

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
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly guestService: GuestService,
    private readonly oauth: OAuthVerificationService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokenResponse> {
    const existing = await this.prisma.user.findFirst({
      where: { email: { equals: dto.email, mode: 'insensitive' } },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name ?? null,
        preferredLanguage: dto.preferredLanguage ?? 'en',
      },
    });

    const guestMerge = await this.maybeMergeGuest(user.id, dto.mergeFromGuestSessionId);
    this.logger.log(`New user registered: ${user.id}`);
    const tokenResponse = this.buildTokenResponse(user);
    return guestMerge ? { ...tokenResponse, guestMerge } : tokenResponse;
  }

  async login(dto: LoginDto): Promise<AuthTokenResponse> {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: dto.email, mode: 'insensitive' } },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.passwordHash) {
      throw new UnauthorizedException('This account uses social sign-in');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.buildTokenResponse(user);
  }

  async loginWithGoogle(dto: GoogleOAuthDto): Promise<AuthTokenResponse> {
    const profile = await this.oauth.verifyGoogleIdToken(dto.idToken);
    return this.loginOrSignUpWithOAuth(
      OAuthProvider.GOOGLE,
      profile,
      dto.mergeFromGuestSessionId,
    );
  }

  async loginWithApple(dto: AppleOAuthDto): Promise<AuthTokenResponse> {
    const profile = await this.oauth.verifyAppleIdToken(dto.idToken);
    const name = dto.fullName?.trim() || profile.name;
    return this.loginOrSignUpWithOAuth(OAuthProvider.APPLE, { ...profile, name }, dto.mergeFromGuestSessionId);
  }

  async loginWithFacebook(dto: FacebookOAuthDto): Promise<AuthTokenResponse> {
    const profile = await this.oauth.verifyFacebookAccessToken(dto.accessToken);
    return this.loginOrSignUpWithOAuth(
      OAuthProvider.FACEBOOK,
      profile,
      dto.mergeFromGuestSessionId,
    );
  }

  private syntheticEmail(provider: OAuthProvider, providerUserId: string): string {
    const safe = providerUserId.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `oauth.${provider.toLowerCase()}.${safe}@users.local`;
  }

  private async loginOrSignUpWithOAuth(
    provider: OAuthProvider,
    profile: OAuthProfile,
    mergeFromGuestSessionId?: string,
  ): Promise<AuthTokenResponse> {
    const linked = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId: profile.providerUserId,
        },
      },
      include: { user: true },
    });

    if (linked?.user) {
      const guestMerge = await this.maybeMergeGuest(linked.user.id, mergeFromGuestSessionId);
      const token = this.buildTokenResponse(linked.user);
      return guestMerge ? { ...token, guestMerge } : token;
    }

    const emailNorm = profile.email?.trim().toLowerCase() ?? null;
    const resolvedEmail = emailNorm ?? this.syntheticEmail(provider, profile.providerUserId);

    const existingByEmail = await this.prisma.user.findFirst({
      where: { email: { equals: resolvedEmail, mode: 'insensitive' } },
    });

    let user = existingByEmail;

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: resolvedEmail,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          oauthAccounts: {
            create: {
              provider,
              providerUserId: profile.providerUserId,
            },
          },
        },
      });
    } else {
      await this.prisma.oAuthAccount.create({
        data: {
          provider,
          providerUserId: profile.providerUserId,
          userId: existingByEmail!.id,
        },
      });
      user = await this.prisma.user.update({
        where: { id: existingByEmail!.id },
        data: {
          name: existingByEmail!.name ?? profile.name,
          avatarUrl: existingByEmail!.avatarUrl ?? profile.avatarUrl,
        },
      });
    }

    const guestMerge = await this.maybeMergeGuest(user!.id, mergeFromGuestSessionId);
    const tokenResponse = this.buildTokenResponse(user!);
    this.logger.log(`OAuth ${provider} sign-in for user ${user!.id}`);
    return guestMerge ? { ...tokenResponse, guestMerge } : tokenResponse;
  }

  private async maybeMergeGuest(
    userId: string,
    mergeFromGuestSessionId?: string,
  ): Promise<{ mergedSaves: number; mergedReads: number } | undefined> {
    if (!mergeFromGuestSessionId) return undefined;
    try {
      return await this.guestService.mergeGuestSessionIntoUser(mergeFromGuestSessionId, userId);
    } catch (err) {
      this.logger.warn(`Guest merge skipped for ${userId}: ${(err as Error).message}`);
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
