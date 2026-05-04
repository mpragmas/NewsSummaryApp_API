import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GuestService } from '../guest/guest.service';

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
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokenResponse> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
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

    let guestMerge: { mergedSaves: number; mergedReads: number } | undefined;
    if (dto.mergeFromGuestSessionId) {
      try {
        guestMerge = await this.guestService.mergeGuestSessionIntoUser(
          dto.mergeFromGuestSessionId,
          user.id,
        );
        this.logger.log(
          `Merged guest session ${dto.mergeFromGuestSessionId} into user ${user.id}: ` +
            `${guestMerge.mergedSaves} saves, ${guestMerge.mergedReads} reads`,
        );
      } catch (err) {
        this.logger.warn(
          `Guest merge skipped for ${user.id}: ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(`New user registered: ${user.id}`);
    const tokenResponse = this.buildTokenResponse(user);
    return guestMerge ? { ...tokenResponse, guestMerge } : tokenResponse;
  }

  async login(dto: LoginDto): Promise<AuthTokenResponse> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.buildTokenResponse(user);
  }

  private buildTokenResponse(user: {
    id: string;
    email: string;
    name: string | null;
    preferredLanguage: string;
  }): AuthTokenResponse {
    const accessToken = this.jwt.sign({ sub: user.id, email: user.email });
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferredLanguage: user.preferredLanguage,
      },
    };
  }
}
