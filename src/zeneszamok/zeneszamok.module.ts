import { Module } from '@nestjs/common';
import { ZeneszamokService } from './zeneszamok.service';
import { ZeneszamokController } from './zeneszamok.controller';

@Module({
  controllers: [ZeneszamokController],
  providers: [ZeneszamokService],
})
export class ZeneszamokModule {}
