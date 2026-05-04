import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class FacebookOAuthDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsOptional()
  @IsUUID('4')
  mergeFromGuestSessionId?: string;
}
