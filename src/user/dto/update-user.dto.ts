import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, MinLength, Matches } from "class-validator";
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters long.' })
  @Matches(/^[a-zA-Z0-9 _áéíóöőúüűÁÉÍÓÖŐÚÜŰ]+$/, {
    message: 'Name cannot contain special characters.',
  })
  @ApiProperty({
    example: "gipszjakab",
    description: "The updated username (letters, numbers, spaces only; no special characters)"
  })
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain letters, numbers, and a special character.',
  })
  @ApiProperty({
    example: "gipszbevagyok1234!",
    description: "The updated password (minimum 6 characters, must include a number and a special character)"
  })
  password?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: "/uploads/profiles/avatar.jpg",
    description: "Path to the user's profile picture"
  })
  profilePicture?: string;

  @IsOptional()
  @ApiProperty({
    enum: Role,
    example: "User",
    description: "The user's role (Admin or User)"
  })
  role?: Role;
}
