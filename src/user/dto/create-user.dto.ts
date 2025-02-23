import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsDate, IsInt, IsOptional, IsDefined} from "class-validator";

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
    @ApiProperty({
        example: "2024-10-01 19:09:01.715",
        description: "The date when the account was created."
    })
    created: Date;
}
