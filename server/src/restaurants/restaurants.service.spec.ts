import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';
import { RestaurantsModule } from './restaurants.module';
import { RestaurantsService } from './restaurants.service';

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RestaurantsModule, AppModule],
    }).compile();

    service = await module.resolve<RestaurantsService>(RestaurantsService);

    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.menus.deleteMany();
    await prisma.restaurants.deleteMany();
    await prisma.genres.deleteMany();
    await prisma.ingredients.deleteMany();
  });

  describe('findOne', () => {
    afterEach(async () => {
      await prisma.restaurants.deleteMany();
      await prisma.genres.deleteMany();
    });

    it('指定したIDのレストランを取得できる', async () => {
      const genre = await prisma.genres.create({
        data: {
          name: 'test genre',
        },
      });

      const restaurant = await service.create({
        name: 'test',
        pic: 'test pic',
        genreId: genre.id,
      });
      const res = await service.findOne(restaurant.id);

      expect(res.name).toBe(restaurant.name);
      expect(res.pic).toBe(restaurant.pic);
      expect(res.genre.name).toBe(genre.name);
    });
  });

  describe('search', () => {
    afterEach(async () => {
      await prisma.restaurants.deleteMany();
      await prisma.genres.deleteMany();
    });

    it('キーワードを含むレストランを取得できる', async () => {
      const genre = await prisma.genres.create({
        data: {
          name: 'ジャンル01',
        },
      });

      const restaurant1 = await prisma.restaurants.create({
        data: {
          name: 'キーワードレストラン01キーワード',
          genreId: genre.id,
        },
      });

      await prisma.restaurants.create({
        data: {
          name: 'レストラン02',
          genreId: genre.id,
        },
      });

      const res = await service.search('キーワード');

      expect(res.length).toBe(1);
      expect(res[0].name).toBe(restaurant1.name);
    });
  });
});
