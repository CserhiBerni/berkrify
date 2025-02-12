import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZeneszamokService } from './zeneszamok.service';
import { CreateZeneszamokDto } from './dto/create-zeneszamok.dto';
import { UpdateZeneszamokDto } from './dto/update-zeneszamok.dto';

@Controller('zeneszamok')
export class ZeneszamokController {
  constructor(private readonly zeneszamokService: ZeneszamokService) {}

  @Post()
  create(@Body() createZeneszamokDto: CreateZeneszamokDto) {
    return this.zeneszamokService.create(createZeneszamokDto);
  }

  @Get()
  findAll() {
    return this.zeneszamokService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zeneszamokService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZeneszamokDto: UpdateZeneszamokDto) {
    return this.zeneszamokService.update(+id, updateZeneszamokDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zeneszamokService.remove(+id);
  }
}
