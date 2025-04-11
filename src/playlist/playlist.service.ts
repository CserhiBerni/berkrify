import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddSongDto } from './dto/add-song.dto';

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {}

  async findLikedSongsPlaylist(userId: number) {
    return this.ensureLikedSongsPlaylistExists(userId);
  }

  async create(createPlaylistDto: CreatePlaylistDto) {
    if (createPlaylistDto.name === "Liked Songs") {
      return this.ensureLikedSongsPlaylistExists(createPlaylistDto.user_id);
    }
  
    return await this.prisma.playlist.create({
      data: {
        name: createPlaylistDto.name,
        description: createPlaylistDto.description,
        coverImagePath: createPlaylistDto.coverImagePath,
        user: {
          connect: { id: createPlaylistDto.user_id }
        }
      },
      include: {
        songs: true
      }
    });
  }
  
  async ensureLikedSongsPlaylistExists(userId: number) {
    const existingLikedPlaylists = await this.prisma.playlist.findMany({
      where: {
        user_id: userId,
        name: "Liked Songs"
      },
      include: {
        songs: {
          include: {
            song: true
          },
          orderBy: {
            position: 'asc'
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    });

    if (existingLikedPlaylists.length === 0) {
      return this.prisma.playlist.create({
        data: {
          name: "Liked Songs",
          description: "Songs you've liked",
          user: {
            connect: { id: userId }
          }
        },
        include: {
          songs: {
            include: {
              song: true
            },
            orderBy: {
              position: 'asc'
            }
          }
        }
      });
    }

    if (existingLikedPlaylists.length === 1) {
      return existingLikedPlaylists[0];
    }

    const [keepPlaylist, ...duplicatesToRemove] = existingLikedPlaylists;
    
    for (const duplicatePlaylist of duplicatesToRemove) {
      for (const playlistSong of duplicatePlaylist.songs) {
        const songExists = keepPlaylist.songs.some(ps => ps.song_id === playlistSong.song_id);

        if (!songExists) {
          await this.prisma.playlistSong.create({
            data: {
              playlist_id: keepPlaylist.id,
              song_id: playlistSong.song_id,
              position: playlistSong.position
            }
          });
        }
      }
      
      try {
        await this.prisma.playlistSong.deleteMany({
          where: { playlist_id: duplicatePlaylist.id }
        });
        
        await this.prisma.playlist.delete({
          where: { id: duplicatePlaylist.id }
        });
      } catch (error) {
        console.error(`Error deleting duplicate Liked Songs playlist ${duplicatePlaylist.id}:`, error);
      }
    }
    
    return keepPlaylist;
  }

  async getPlaylistSongs(playlistId: number) {
    return await this.prisma.playlistSong.findMany({
      where: { playlist_id: playlistId },
      include: {
        song: true
      },
      orderBy: {
        position: 'asc'
      }
    });
  }
  
  async findAll() {
    return await this.prisma.playlist.findMany({
      include: {
        songs: {
          include: {
            song: true
          }
        }
      }
    });
  }

  async findUserPlaylists(userId: number) {
    await this.ensureLikedSongsPlaylistExists(userId);
    
    return await this.prisma.playlist.findMany({
      where: {
        user_id: userId
      },
      include: {
        songs: {
          include: {
            song: true
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    });
  }

  async findOne(id: number) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
      include: {
        songs: {
          include: {
            song: true
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }

    return playlist;
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return await this.prisma.playlist.update({
      where: { id },
      data: updatePlaylistDto,
    });
  }

  async addSong(playlistId: number, addSongDto: AddSongDto) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId }
    });

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${playlistId} not found`);
    }

    const song = await this.prisma.songs.findUnique({
      where: { id: addSongDto.song_id }
    });

    if (!song) {
      throw new NotFoundException(`Song with ID ${addSongDto.song_id} not found`);
    }

    const existingSong = await this.prisma.playlistSong.findFirst({
      where: {
        playlist_id: playlistId,
        song_id: addSongDto.song_id
      }
    });

    if (existingSong) {
      return await this.prisma.playlistSong.update({
        where: { id: existingSong.id },
        data: { position: addSongDto.position },
        include: { song: true }
      });
    }

    return await this.prisma.playlistSong.create({
      data: {
        playlist: {
          connect: { id: playlistId }
        },
        song: {
          connect: { id: addSongDto.song_id }
        },
        position: addSongDto.position
      },
      include: { song: true }
    });
  }

  async removeSong(playlistId: number, songId: number) {
    const playlistSong = await this.prisma.playlistSong.findFirst({
      where: {
        playlist_id: playlistId,
        song_id: songId
      }
    });

    if (!playlistSong) {
      throw new NotFoundException(`Song with ID ${songId} not found in playlist ${playlistId}`);
    }

    return await this.prisma.playlistSong.delete({
      where: { id: playlistSong.id }
    });
  }

  async remove(id: number) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id }
    });
    
    if (playlist && playlist.name === "Liked Songs") {
      throw new Error("Cannot delete the 'Liked Songs' playlist");
    }
    
    return await this.prisma.playlist.delete({
      where: { id }
    });
  }
}