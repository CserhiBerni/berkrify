import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZeneszamokModule } from './zeneszamok/zeneszamok.module';

@Module({
  imports: [ZeneszamokModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
