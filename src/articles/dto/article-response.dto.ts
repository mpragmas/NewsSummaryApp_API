export class ArticleResponseDto {
  id: string;
  title: string;
  content: string;
  /** Summary in the originally requested language with fallback chain. */
  summary: string | null;
  summaryFr: string | null;
  summaryRw: string | null;
  originalLanguage: string;
  source: string;
  url: string;
  imageUrl: string | null;
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
