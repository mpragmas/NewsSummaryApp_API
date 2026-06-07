import { IsNotEmpty, IsString } from 'class-validator';

/** Admin-only username/password login. There is no signup counterpart — accounts are pre-provisioned. */
export class CredentialsLoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
