import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsDate, IsInt, IsOptional, IsDefined} from "class-validator";

export class CreateSongDto {
  @IsString()
  @ApiProperty({
    example: 'Denzel Curry',
    description: 'The name of the artist'
  })
  artist: string;

  @IsString()
  @ApiProperty({
    example: 'gnx',
    description: 'The name of the album'
  })
  album: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Fej és Vállak',
    description: 'The name of the song'
  })
  song: string;

  @IsDate()
  @ApiProperty({
    example: '2024-10-01 19:09:01.715',
    description: 'The duration of the song and the date of its upload'
  })
  length: Date;

  @IsInt()
  @ApiProperty({
    example: '2018',
    description: 'The release date of the song'
  })
  release_yr: number;

  @IsString()
  @ApiProperty({
    example: 'r&b',
    description: 'The genre of the song'
  })
  genre: string;

  @IsDefined()
  @ApiProperty({
    example: 'UklGRiIAAABXQVZFZm10IBAAAAABAAEARKwAABCx...',
    description: 'Base64 encoded MP3 file data'
  })
  mp3: Buffer;
  
  @IsOptional()
  @ApiProperty({
    example: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9h...',
    description: 'Base64 encoded cover image file (optional)'
  })
  cover?: Buffer;
}
