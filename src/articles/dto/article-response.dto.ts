export class ArticleResponseDto {
  id: string;
  title: string;
  content: string;
  /** Summary in the originally requested language (EN or FR with fallback). */
  summary: string | null;
  summaryFr: string | null;
  originalLanguage: string;
  source: string;
  url: string;
  category: string | null;
  continent: string | null;
  region: string | null;
  country: string | null;
  publishedAt: Date;
  createdAt: Date;
}

export class PaginatedArticlesDto {
  data: ArticleResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
