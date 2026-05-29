import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StoriesService } from './stories.service';
import { QueryStoriesDto } from './dto/query-stories.dto';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { AdminApiKeyGuard } from '../common/guards/admin-api-key.guard';
import { AuthUser } from '../auth/strategies/jwt.strategy';

interface AuthRequest extends Request {
  user?: AuthUser;
}

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  findAll(@Query() query: QueryStoriesDto, @Request() req: AuthRequest) {
    return this.storiesService.findAll(query, req.user?.userId);
  }

  // Static segment declared before @Get(':id') so it isn't captured as an id.
  @Post('recluster')
  @UseGuards(AdminApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  recluster(@Query('rebuild') rebuild?: string) {
    return this.storiesService.recluster(rebuild === 'true' || rebuild === '1');
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('lang') lang: 'en' | 'fr' | 'rw' | undefined,
    @Request() req: AuthRequest,
  ) {
    return this.storiesService.findOne(id, lang, req.user?.userId);
  }

  @Get(':id/sources')
  findSources(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('lang') lang?: 'en' | 'fr' | 'rw',
  ) {
    return this.storiesService.findSources(id, lang);
  }
}
