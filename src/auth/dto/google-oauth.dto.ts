import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class GoogleOAuthDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @IsOptional()
  @IsUUID('4')
  mergeFromGuestSessionId?: string;
}
