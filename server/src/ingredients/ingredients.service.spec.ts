import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';
import { resetDb } from '../reset-db';
import { IngredientsModule } from './ingredients.module';
import { IngredientsService } from './ingredients.service';

describe('IngredientsService', () => {
  let service: IngredientsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [IngredientsModule, AppModule],
    }).compile();

    service = module.get<IngredientsService>(IngredientsService);

    prisma = module.get<PrismaService>(PrismaService);

    await resetDb(prisma);
  });

  afterAll(async () => {
    await resetDb(prisma);
  });

  describe('findAll', () => {
    beforeAll(async () => {
      await prisma.ingredients.createMany({
        data: [
          {
            name: 'ingredient1',
            pic: 'pic1',
          },
          {
            name: 'ingredient2',
            pic: 'pic2',
          },
          {
            name: 'ingredient3',
            pic: 'pic3',
          },
        ],
      });
    });
    it('全ての原材料を取得できる', async () => {
      const res = await service.findAll();

      expect(res.length).toBe(3);
      expect(res[0].name).toBe('ingredient1');
    });
  });
});
