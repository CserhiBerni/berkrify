import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsDate, IsInt, IsOptional, IsDefined} from "class-validator";

export class CreateFavoriteDto {
    @IsInt()
    @IsOptional()
    @ApiProperty({
      example: "3",
      description: "The id of the user."
    })
    user_id: number;
  
    @IsInt()
    @ApiProperty({
      example: "2",
      description: "The id of the song."
    })
    song_id: number;
  }
  