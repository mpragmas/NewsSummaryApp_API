import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsIn,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryStoriesDto {
  @IsOptional()
  @IsIn(['en', 'fr', 'rw'])
  lang?: 'en' | 'fr' | 'rw';

  /** Search across canonical title/summary and member article titles/summaries. */
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
}
