import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  // Remove any @Matches decorator if present
  password: string;

  @IsOptional()
  @IsString()
  country_id?: string;
}
