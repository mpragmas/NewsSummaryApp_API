import { IsOptional, IsString, IsInt, Min, Max, IsIn, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryArticlesDto {
  @IsOptional()
  @IsIn(['en', 'fr', 'rw'])
  lang?: 'en' | 'fr' | 'rw';

  /** Full-text style search across title, summaries, and body (PostgreSQL case-insensitive contains). */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  query?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  continent?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsIn(['publishedAt', 'createdAt'])
  sortBy?: 'publishedAt' | 'createdAt' = 'publishedAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
