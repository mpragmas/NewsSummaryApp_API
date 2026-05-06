import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  MethodNotAllowedException,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { AdminApiKeyGuard } from '../common/guards/admin-api-key.guard';
import { UsersService } from '../users/users.service';
import { GuestService } from '../guest/guest.service';
import { AuthUser } from '../auth/strategies/jwt.strategy';

interface AuthRequest extends Request {
  user?: AuthUser;
}

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly usersService: UsersService,
    private readonly guestService: GuestService,
  ) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  findAll(@Query() query: QueryArticlesDto, @Request() req: AuthRequest) {
    return this.articlesService.findAll(query, req.user?.userId);
  }

  // POST /articles/ingest — declared before @Get(':id') so static segment wins.
  @Post('ingest')
  // @UseGuards(AdminApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  ingest() {
    return this.articlesService.ingest();
  }

  // GET guard so hitting /articles/ingest in a browser gives a clear message.
  @Get('ingest')
  ingestGet() {
    throw new MethodNotAllowedException(
      'Use POST /api/v1/articles/ingest to trigger ingestion',
    );
  }

  /** Queue + provider observability — counts, cooldowns, and current model. */
  @Get('processing-status')
  processingStatus() {
    return this.articlesService.getProcessingStatus();
  }

  @Post('resummarize')
  @UseGuards(AdminApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  resummarize() {
    return this.articlesService.resummarizeUnsummarized();
  }

  /** Generate missing French summaries for all articles (sequential, rate-limited). */
  @Post('backfill-french')
  @UseGuards(AdminApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  backfillFrench() {
    return this.articlesService.backfillFrench();
  }

  @Get('backfill-french')
  backfillFrenchGet() {
    throw new MethodNotAllowedException(
      'Use POST /api/v1/articles/backfill-french to start French backfill',
    );
  }

  /** Generate missing Kinyarwanda summaries for rw articles. */
  @Post('backfill-rw')
  @UseGuards(AdminApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  backfillKinyarwanda() {
    return this.articlesService.backfillKinyarwanda();
  }

  @Get('backfill-rw')
  backfillRwGet() {
    throw new MethodNotAllowedException(
      'Use POST /api/v1/articles/backfill-rw to start Kinyarwanda backfill',
    );
  }

  @Post(':id/summarize')
  @UseGuards(AdminApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  summarize(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('lang') lang?: 'en' | 'fr' | 'rw',
  ) {
    return this.articlesService.summarizeOne(id, lang);
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('lang') lang: 'en' | 'fr' | 'rw' | undefined,
    @Request() req: AuthRequest,
    @Headers('x-guest-session-id') guestSessionId?: string,
  ) {
    const article = await this.articlesService.findOne(id, lang);
    if (req.user?.userId) {
      // Fire-and-forget — reading history must never block the response
      this.usersService.recordRead(req.user.userId, id).catch(() => undefined);
    } else if (guestSessionId && /^[0-9a-f-]{36}$/i.test(guestSessionId)) {
      this.guestService.recordRead(guestSessionId, id).catch(() => undefined);
    }
    return article;
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  saveArticle(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthRequest,
  ) {
    return this.usersService.saveArticle(req.user!.userId, id);
  }

  @Delete(':id/save')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  unsaveArticle(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthRequest,
  ) {
    return this.usersService.unsaveArticle(req.user!.userId, id);
  }
}
