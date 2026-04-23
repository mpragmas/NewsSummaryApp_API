import {
  IsOptional,
  IsString,
  IsIn,
  IsArray,
  IsBoolean,
  IsUrl,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsIn(['en', 'fr'])
  preferredLanguage?: 'en' | 'fr';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteTopics?: string[];

  @IsOptional()
  @IsBoolean()
  dailyDigest?: boolean;

  @IsOptional()
  @IsBoolean()
  breakingNews?: boolean;
}
