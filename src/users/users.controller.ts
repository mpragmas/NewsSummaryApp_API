import {
  Controller,
  Get,
  Patch,
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

  @Get('saved-articles')
  getSavedArticles(
    @Request() req: AuthRequest,
    @Query('lang') lang?: 'en' | 'fr',
  ) {
    return this.usersService.getSavedArticles(req.user.userId, lang);
  }

  @Get('history')
  getHistory(
    @Request() req: AuthRequest,
    @Query('lang') lang?: 'en' | 'fr',
  ) {
    return this.usersService.getReadingHistory(req.user.userId, lang);
  }
}
