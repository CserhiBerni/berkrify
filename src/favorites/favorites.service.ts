import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFavoriteDto: CreateFavoriteDto) {
    return this.prisma.favorites.create({
      data: {
        user_id: createFavoriteDto.user_id,
        song_id: createFavoriteDto.song_id,
      },
    });
  }

  async findAll() {
    return this.prisma.favorites.findMany({
      include: {
        song: true,
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.favorites.findMany({
      where: { user_id: userId },
      include: {
        song: true,
      },
    });
  }

  async findOne(id: number) {
    const favorite = await this.prisma.favorites.findUnique({
      where: { id },
      include: {
        song: true,
      },
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }

    return favorite;
  }

  async update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    return this.prisma.favorites.update({
      where: { id },
      data: updateFavoriteDto,
    });
  }

  async remove(id: number) {
    return this.prisma.favorites.delete({
      where: { id },
    });
  }

  async removeBySongAndUser(songId: number, userId: number) {
    const favorite = await this.prisma.favorites.findFirst({
      where: {
        song_id: songId,
        user_id: userId,
      },
    });
  
    if (!favorite) {
      throw new NotFoundException(`Favorite not found for user ${userId} and song ${songId}`);
    }
  
    return this.prisma.favorites.delete({
      where: { id: favorite.id },
    });
  }
}
