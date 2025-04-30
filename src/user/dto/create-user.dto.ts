import { ApiProperty } from "@nestjs/swagger";
import { Role } from '@prisma/client';
import { IsString, IsNotEmpty, IsDate, IsOptional, IsEnum, MinLength, Matches, IsEmail } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long.' })
  @Matches(/^[a-zA-Z0-9 _áéíóöőúüűÁÉÍÓÖŐÚÜŰ]+$/, {
    message: 'Name cannot contain special characters.',
  })
  @ApiProperty({
    example: "gipszjakab",
    description: "The user's username (letters, numbers, spaces allowed only)"
  })
  name: string;

  @IsEmail({}, { message: 'Invalid email format.' })
  @ApiProperty({
    example: "gipszjakab@gmail.com",
    description: "The user's email address"
  })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @Matches(/(?=.*[0-9])/, {
    message: 'Password must contain at least one number.',
  })
  @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one special character (!@#$%^&*).',
  })
  @ApiProperty({
    example: "gipszbevagyok1234!",
    description: "The user's password (minimum 6 characters, must include a number and a special character)"
  })
  password: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: "2024-10-01 19:09:01.715",
    description: "The date when the account was created"
  })
  created?: Date;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty({
    enum: Role,
    example: "User",
    description: "The user's role (Admin or User)"
  })
  role?: Role;
}
