import { Test, TestingModule } from '@nestjs/testing';
import { ZeneszamokService } from './zeneszamok.service';

describe('ZeneszamokService', () => {
  let service: ZeneszamokService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZeneszamokService],
    }).compile();

    service = module.get<ZeneszamokService>(ZeneszamokService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
