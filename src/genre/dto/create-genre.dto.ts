import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsDate, IsInt, IsOptional, IsDefined} from "class-validator";

export class CreateGenreDto {
    @IsString()
    @ApiProperty({
        example: "Jazz",
        description: "The genre name of the music."
    })
    genre: string;
}

