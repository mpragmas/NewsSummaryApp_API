export class ArticleResponseDto {
  id: string;
  title: string;
  content: string;
  summary: string | null;
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
