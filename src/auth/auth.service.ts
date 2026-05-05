import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { GuestService } from '../guest/guest.service';
import { FirebaseVerificationService } from './services/firebase-verification.service';
import { FirebaseAuthDto } from './dto/firebase-auth.dto';

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
    private readonly firebase: FirebaseVerificationService,
  ) {}

  async loginWithFirebase(dto: FirebaseAuthDto): Promise<AuthTokenResponse> {
    const profile = await this.firebase.verifyIdToken(dto.idToken);

    let user = await this.prisma.user.findUnique({
      where: { firebaseUid: profile.uid },
    });

    if (!user && profile.email) {
      user = await this.prisma.user.findFirst({
        where: { email: { equals: profile.email, mode: 'insensitive' } },
      });
      if (user) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            firebaseUid: profile.uid,
            name: user.name ?? profile.name,
            avatarUrl: user.avatarUrl ?? profile.picture,
          },
        });
      }
    }

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          firebaseUid: profile.uid,
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.picture,
        },
      });
    }

    const guestMerge = await this.maybeMergeGuest(
      user.id,
      dto.mergeFromGuestSessionId,
    );
    const tokenResponse = this.buildTokenResponse(user);
    this.logger.log(`Firebase sign-in for user ${user.id}`);
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
