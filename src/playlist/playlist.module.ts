import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService, PrismaService],
})
export class PlaylistModule {}
