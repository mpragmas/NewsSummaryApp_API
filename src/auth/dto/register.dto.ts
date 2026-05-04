import { IsEmail, IsString, MinLength, IsOptional, IsIn, IsUUID } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['en', 'fr'])
  preferredLanguage?: 'en' | 'fr';

  /** If set, guest bookmarks & reading history for this session are merged into the new account. */
  @IsOptional()
  @IsUUID('4')
  mergeFromGuestSessionId?: string;
}
