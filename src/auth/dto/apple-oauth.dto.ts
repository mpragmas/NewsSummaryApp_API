import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class AppleOAuthDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;

  /** Apple only sends the display name on the first authorization; client may forward it here. */
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsUUID('4')
  mergeFromGuestSessionId?: string;
}
