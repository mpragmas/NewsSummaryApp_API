import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class OAuthAuthDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @IsOptional()
  @IsUUID('4')
  mergeFromGuestSessionId?: string;
}
