import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class FirebaseAuthDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @IsOptional()
  @IsUUID('4')
  mergeFromGuestSessionId?: string;
}
