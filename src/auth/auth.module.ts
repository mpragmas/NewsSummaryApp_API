import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OptionalJwtGuard } from './guards/optional-jwt.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { GuestModule } from '../guest/guest.module';

@Module({
  imports: [
    PrismaModule,
    GuestModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        signOptions: { expiresIn: (config.get<string>('jwt.expiresIn') ?? '7d') as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OptionalJwtGuard],
  exports: [JwtModule, PassportModule, OptionalJwtGuard],
})
export class AuthModule {}
