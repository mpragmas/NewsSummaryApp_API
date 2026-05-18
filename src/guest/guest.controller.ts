import {
  Controller,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GuestService } from './guest.service';

@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  /** Create a guest session id to attach bookmarks / optional reading history before signup. */
  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  createSession() {
    return this.guestService.createSession();
  }

  /** Bookmark an article for a guest session (merged into the user on register when requested). */
  @Post('sessions/:sessionId/articles/:articleId/save')
  @HttpCode(HttpStatus.OK)
  saveArticle(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ) {
    return this.guestService.saveArticle(sessionId, articleId);
  }
}
