import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZeneszamokModule } from './zeneszamok/zeneszamok.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ZeneszamokModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
