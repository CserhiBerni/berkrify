import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { SongsModule } from './songs/songs.module';
import { UserModule } from './user/user.module';
import { GenreModule } from './genre/genre.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AuthModule } from './auth/auth.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [SongsModule, UserModule, GenreModule, FavoritesModule, AuthModule, PlaylistModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
