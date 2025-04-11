import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, IsOptional } from "class-validator";

export class CreatePlaylistDto {
  @IsString()
  @ApiProperty({
    example: 'My Favorite Songs',
    description: 'Name of the playlist'
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'A collection of my favorite songs',
    description: 'Description of the playlist'
  })
  description?: string;

  @IsInt()
  @IsOptional() 
  @ApiProperty({
    example: 1,
    description: 'ID of the user creating the playlist'
  })
  user_id: number;

  @ApiProperty({
   example: '/uploads/playlistcover/image.png', 
   description: 'Path to the cover image' 
  })
  coverImagePath?: string;
}