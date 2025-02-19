import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [SongsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
