import { Injectable } from '@nestjs/common';
import { AuthProvider, User } from '../../generated/prisma';
import { PrismaService } from '../../prisma/prisma.service';

export interface VerifiedOAuthIdentity {
  provider: AuthProvider;
  providerAccountId: string;
  email: string | null;
  emailVerified: boolean;
  name: string | null;
  picture: string | null;
}

@Injectable()
export class PrismaOAuthAdapterService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateUser(identity: VerifiedOAuthIdentity): Promise<User> {
    const linked = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: identity.provider,
          providerAccountId: identity.providerAccountId,
        },
      },
      include: { user: true },
    });
    if (linked) return linked.user;

    return this.prisma.$transaction(async (tx) => {
      let user: User | null = null;

      if (identity.email && identity.emailVerified) {
        user = await tx.user.findFirst({
          where: { email: { equals: identity.email, mode: 'insensitive' } },
        });
      }

      if (!user) {
        user = await tx.user.create({
          data: {
            email: identity.email,
            name: identity.name,
            avatarUrl: identity.picture,
          },
        });
      } else {
        user = await tx.user.update({
          where: { id: user.id },
          data: {
            email: user.email ?? identity.email,
            name: user.name ?? identity.name,
            avatarUrl: user.avatarUrl ?? identity.picture,
          },
        });
      }

      await tx.oAuthAccount.create({
        data: {
          userId: user.id,
          provider: identity.provider,
          providerAccountId: identity.providerAccountId,
        },
      });

      return user;
    });
  }
}
