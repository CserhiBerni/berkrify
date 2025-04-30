import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { PrismaService } from 'src/prisma.service';

describe('SongsService', () => {
  let service: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongsService, PrismaService],
    }).compile();

    service = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
