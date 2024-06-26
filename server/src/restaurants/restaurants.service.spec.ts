import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';
import { RestaurantsModule } from './restaurants.module';
import { RestaurantsService } from './restaurants.service';

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RestaurantsModule, AppModule],
    }).compile();

    service = await module.resolve<RestaurantsService>(RestaurantsService);

    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.restaurants.deleteMany();
  });

  describe('findOne', () => {
    it('指定したIDのレストランを取得できる', async () => {
      const genre = await prisma.genres.create({
        data: {
          name: 'test genre',
        },
      });

      const restaurant = await service.create({
        name: 'test',
        address: 'test address',
        pic: 'test pic',
        genreId: genre.id,
      });
      const res = await service.findOne(restaurant.id);

      expect(res.name).toBe(restaurant.name);
      expect(res.address).toBe(restaurant.address);
      expect(res.pic).toBe(restaurant.pic);
      expect(res.genre.name).toBe(genre.name);
    });
  });
});
