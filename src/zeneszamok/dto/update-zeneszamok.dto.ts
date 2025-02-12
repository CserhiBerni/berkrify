import { PartialType } from '@nestjs/mapped-types';
import { CreateZeneszamokDto } from './create-zeneszamok.dto';

export class UpdateZeneszamokDto extends PartialType(CreateZeneszamokDto) {}
