import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Common date-range + filter query for admin analytics endpoints.
 * `from`/`to` are ISO date strings; when omitted the service defaults to the
 * trailing `days` window (default 30).
 */
export class AnalyticsQueryDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  days?: number;

  /** Bucket granularity for time-series. */
  @IsOptional()
  @IsIn(['day', 'hour'])
  interval?: 'day' | 'hour';

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
