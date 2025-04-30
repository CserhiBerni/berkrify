import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class AddSongDto {
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'ID of the song'
  })
  song_id: number;
}