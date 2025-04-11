import { ApiProperty } from "@nestjs/swagger";
import { Role } from '@prisma/client';
import { IsString, IsNotEmpty, IsDate, IsInt, IsOptional, IsDefined, IsEnum} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "gipszjakab",
        description: "The user's username"
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "gipszjakab@gmail.com",
        description: "The user's email"
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "gipszbevagyok1234!",
        description: "The user's password"
    })
    password: string;

    @IsDate()
    @IsOptional()
    @ApiProperty({
        example: "2024-10-01 19:09:01.715",
        description: "The date when the account was created."
    })
    created?: Date;

    @IsEnum(Role)
    @IsOptional()
    @ApiProperty({
        enum: Role,
        example: "User",
        description: "The user's role"
    })
    role?: Role;
}
