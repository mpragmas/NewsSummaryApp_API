import { ArticleResponseDto } from '../../articles/dto/article-response.dto';

/** A single source's contribution to a story (preview form, for cards). */
export class StorySourcePreviewDto {
  articleId: string;
  source: string;
}

/** A story cluster in list form (home feed / search results). */
export class StoryListItemDto {
  id: string;
  canonicalTitle: string;
  canonicalSummary: string | null;
  imageUrl: string | null;
  category: string | null;
  continent: string | null;
  region: string | null;
  country: string | null;
  language: string;
  sourceCount: number;
  articleCount: number;
  /** Languages present among member articles (variants). */
  languages: string[];
  /** Lead/canonical source article — used for "save story" + deep link. */
  leadArticleId: string | null;
  /** Distinct sources covering this story (for source chips). */
  sources: StorySourcePreviewDto[];
  latestPublishedAt: Date;
  createdAt: Date;
}

export class PaginatedStoriesDto {
  data: StoryListItemDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Full story: canonical fields + every source article (language-viewed). */
export class StoryDetailDto extends StoryListItemDto {
  /** All source articles, mapped exactly like the /articles endpoints. */
  articles: ArticleResponseDto[];
}
