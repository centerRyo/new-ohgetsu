import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';
import { GenresModule } from './genres.module';
import { GenresService } from './genres.service';

describe('GenresService', () => {
  let service: GenresService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GenresModule, AppModule],
    }).compile();

    service = module.get<GenresService>(GenresService);

    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.genres.deleteMany();
  });

  describe('findAll', () => {
    beforeAll(async () => {
      await prisma.genres.createMany({
        data: [
          {
            name: 'genre1',
          },
          {
            name: 'genre2',
          },
          {
            name: 'genre3',
          },
        ],
      });
    });
    it('全てのジャンルを取得できる', async () => {
      const res = await service.findAll();

      expect(res.length).toBe(3);
      expect(res[0].name).toBe('genre1');
    });
  });
});
