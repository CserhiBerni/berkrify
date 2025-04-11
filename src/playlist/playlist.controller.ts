import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddSongDto } from './dto/add-song.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { UseInterceptors, UploadedFile } from '@nestjs/common';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) { }

  @Post('upload/cover')
  @UseGuards(AuthGuard('bearer'))
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/playlistcovers', 
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `playlist-${uniqueSuffix}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }))
  uploadCover(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      url: `/uploads/playlistcovers/${file.filename}`
    };
  }

  @Post()
  @UseGuards(AuthGuard('bearer'))
  create(@Body() createPlaylistDto: CreatePlaylistDto, @Request() req) {
    createPlaylistDto.user_id = req.user.id;
    return this.playlistService.create(createPlaylistDto);
  }

  @Get()
  findAll() {
    return this.playlistService.findAll();
  }

  @Get('user')
  @UseGuards(AuthGuard('bearer'))
  findUserPlaylists(@Request() req) {
    return this.playlistService.findUserPlaylists(req.user.id);
  }

  @Get('liked-songs')
  @UseGuards(AuthGuard('bearer'))
  findLikedSongsPlaylist(@Request() req) {
    return this.playlistService.findLikedSongsPlaylist(req.user.id);
  }

  @Get(':id/songs')
  async getPlaylistSongs(@Param('id') id: string) {
    try {
      const playlist = await this.playlistService.findOne(+id);
      
      return this.playlistService.getPlaylistSongs(+id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Playlist not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.playlistService.findOne(+id);
    } catch (error) {
      throw new HttpException('Playlist not found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('bearer'))
  async update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto, @Request() req) {
    try {
      const playlist = await this.playlistService.findOne(+id);
      
      if (playlist.user_id !== req.user.id) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      
      return this.playlistService.update(+id, updatePlaylistDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error updating playlist', HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/songs')
  @UseGuards(AuthGuard('bearer'))
  async addSong(@Param('id') id: string, @Body() addSongDto: AddSongDto, @Request() req) {
    try {
      const playlist = await this.playlistService.findOne(+id);
      
      if (playlist.user_id !== req.user.id) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      
      if (!addSongDto.song_id) {
        throw new HttpException('Song ID is required', HttpStatus.BAD_REQUEST);
      }
      
      return this.playlistService.addSong(+id, addSongDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error adding song to playlist', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id/songs/:songId')
  @UseGuards(AuthGuard('bearer'))
  async removeSong(@Param('id') id: string, @Param('songId') songId: string, @Request() req) {
    try {
      const playlist = await this.playlistService.findOne(+id);
      
      if (playlist.user_id !== req.user.id) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      
      return this.playlistService.removeSong(+id, +songId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error removing song from playlist', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('bearer'))
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const playlist = await this.playlistService.findOne(+id);
      
      if (playlist.user_id !== req.user.id) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      
      return this.playlistService.remove(+id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error deleting playlist', HttpStatus.BAD_REQUEST);
    }
  }
}