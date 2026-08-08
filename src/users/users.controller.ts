import {
  Controller,
  Get,
  Patch,
  Delete,
  HttpCode,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/strategies/jwt.strategy';

interface AuthRequest extends Request {
  user: AuthUser;
}

@Controller('me')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getProfile(@Request() req: AuthRequest) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch()
  updateProfile(@Request() req: AuthRequest, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  /** Play Store policy requires an in-app path to permanent account deletion. */
  @Delete()
  @HttpCode(200)
  deleteAccount(@Request() req: AuthRequest) {
    return this.usersService.deleteAccount(req.user.userId);
  }

  @Get('saved-articles')
  getSavedArticles(
    @Request() req: AuthRequest,
    @Query('lang') lang?: 'en' | 'fr' | 'rw',
  ) {
    return this.usersService.getSavedArticles(req.user.userId, lang);
  }

  @Get('history')
  getHistory(
    @Request() req: AuthRequest,
    @Query('lang') lang?: 'en' | 'fr' | 'rw',
  ) {
    return this.usersService.getReadingHistory(req.user.userId, lang);
  }
}
