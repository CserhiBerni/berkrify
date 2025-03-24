import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateSongDto } from './dto/update-song.dto';
import { CreateSongDto } from './dto/create-song.dto';

@Injectable()
export class SongsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createSongDto: CreateSongDto) {
        return await this.prisma.songs.create({
            data: createSongDto,
        });
    }

    async findAll() {
        return await this.prisma.songs.findMany();
    }

    async findOne(id: number) {
        const song = await this.prisma.songs.findUnique({ where: { id } });
        if (!song) throw new NotFoundException('The song cannot be found.');
        return song;
    }

    update(id: number, updateSongDto: UpdateSongDto) {
        return this.prisma.songs.update({
            where: { id },
            data: updateSongDto,
        });
    }

    remove(id: number) {
        return this.prisma.songs.delete({ where: { id } });
    }
}
