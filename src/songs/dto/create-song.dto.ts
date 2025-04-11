import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, IsOptional } from "class-validator";

export class CreateSongDto {
  @IsString()
  @ApiProperty({
    example: 'Denzel Curry',
    description: 'The name of the artist'
  })
  artist: string; 

  @IsString()
  @ApiProperty({
    example: 'Imperial',
    description: 'The name of the album'
  })
  album: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'This Life',
    description: 'The name of the song'
  })
  song: string;

  @IsInt()
  @ApiProperty({ 
    example: 207, 
    description: 'The duration of the song in seconds'
 })
  length: number;

  @IsInt()
  @ApiProperty({
    example: 2016, 
    description: 'The release year of the song' 
  })
  release_yr: number;

  @IsString()
  @ApiProperty({
    example: 'rap',
    description: 'The genre of the song' 
  })
  genre: string;

  @IsOptional()
  @ApiProperty({
    example: '/uploads/mp3/song.mp3',
    description: 'Path to the MP3 file' 
  })
  mp3: string;

  @IsOptional()
  @ApiProperty({
   example: '/uploads/covers/image.png', 
   description: 'Path to the cover image' 
  })
  cover: string;
}
