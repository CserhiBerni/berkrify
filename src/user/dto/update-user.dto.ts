import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";
import { Role } from '@prisma/client';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: "gipszjakab",
        description: "The user's username"
    })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: "gipszbevagyok1234!",
        description: "The user's password"
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
        description: "The user's role"
    })
    role?: Role;
}