import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export enum OAuthProvider {
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
}

export class OAuthAuthDto {
  @IsEnum(OAuthProvider)
  provider: OAuthProvider;

  @ValidateIf((dto: OAuthAuthDto) =>
    dto.provider === OAuthProvider.GOOGLE || dto.provider === OAuthProvider.APPLE,
  )
  @IsString()
  @IsNotEmpty()
  idToken?: string;

  @ValidateIf((dto: OAuthAuthDto) => dto.provider === OAuthProvider.FACEBOOK)
  @IsString()
  @IsNotEmpty()
  accessToken?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nonce?: string;

  @IsOptional()
  @IsUUID('4')
  mergeFromGuestSessionId?: string;
}
