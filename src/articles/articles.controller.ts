import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  MethodNotAllowedException,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { QueryArticlesDto } from './dto/query-articles.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(@Query() query: QueryArticlesDto) {
    return this.articlesService.findAll(query);
  }

  // POST /articles/ingest — must be declared before @Get(':id') so the static
  // segment wins over the dynamic one during route matching.
  @Post('ingest')
  @HttpCode(HttpStatus.OK)
  ingest() {
    return this.articlesService.ingest();
  }

  // GET guard so hitting /articles/ingest in a browser shows a clear message
  // instead of falling through to @Get(':id') and failing UUID validation.
  @Get('ingest')
  ingestGet() {
    throw new MethodNotAllowedException(
      'Use POST /api/v1/articles/ingest to trigger ingestion',
    );
  }

  @Post(':id/summarize')
  @HttpCode(HttpStatus.OK)
  summarize(@Param('id', ParseUUIDPipe) id: string) {
    return this.articlesService.summarizeOne(id);
  }

  @Post('resummarize')
  @HttpCode(HttpStatus.OK)
  resummarize() {
    return this.articlesService.resummarizeUnsummarized();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.articlesService.findOne(id);
  }
}
