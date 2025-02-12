import { Test, TestingModule } from '@nestjs/testing';
import { ZeneszamokController } from './zeneszamok.controller';
import { ZeneszamokService } from './zeneszamok.service';

describe('ZeneszamokController', () => {
  let controller: ZeneszamokController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZeneszamokController],
      providers: [ZeneszamokService],
    }).compile();

    controller = module.get<ZeneszamokController>(ZeneszamokController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
