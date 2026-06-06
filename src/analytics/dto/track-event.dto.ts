import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AnalyticsEventType } from '../../generated/prisma';

/**
 * A single client-emitted analytics event. The client supplies only the
 * product context — server-derived fields (userId, device, country, region,
 * referrer) are filled in by the controller from the authenticated request and
 * never trusted from the body.
 */
export class TrackEventDto {
  @IsEnum(AnalyticsEventType)
  type!: AnalyticsEventType;

  /** Stable anonymous client/session id generated on the device. */
  @IsString()
  @Length(1, 128)
  sessionId!: string;

  @IsOptional()
  @IsString()
  @Length(1, 128)
  articleId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 128)
  clusterId?: string;

  /** Publisher / source name for source-switch and click events. */
  @IsOptional()
  @IsString()
  @Length(1, 200)
  source?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  category?: string;

  @IsOptional()
  @IsString()
  @Length(1, 16)
  language?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  region?: string;

  /** Search text for SEARCH events. */
  @IsOptional()
  @IsString()
  @Length(0, 200)
  query?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  resultCount?: number;

  /** Reading / session duration in ms (heartbeats, article reads). */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(86_400_000)
  durationMs?: number;
}

/**
 * Batch envelope — the web client buffers events and flushes them together
 * (sendBeacon-friendly) so analytics never blocks user interactions.
 */
export class BatchTrackDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackEventDto)
  events!: TrackEventDto[];
}
