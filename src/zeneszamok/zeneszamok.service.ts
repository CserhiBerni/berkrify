import { Injectable } from '@nestjs/common';
import { CreateZeneszamokDto } from './dto/create-zeneszamok.dto';
import { UpdateZeneszamokDto } from './dto/update-zeneszamok.dto';

@Injectable()
export class ZeneszamokService {
  create(createZeneszamokDto: CreateZeneszamokDto) {
    return 'This action adds a new zeneszamok';
  }

  findAll() {
    return `This action returns all zeneszamok`;
  }

  findOne(id: number) {
    return `This action returns a #${id} zeneszamok`;
  }

  update(id: number, updateZeneszamokDto: UpdateZeneszamokDto) {
    return `This action updates a #${id} zeneszamok`;
  }

  remove(id: number) {
    return `This action removes a #${id} zeneszamok`;
  }
}
