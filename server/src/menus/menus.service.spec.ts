import { Test, TestingModule } from '@nestjs/testing';
import { ingredients, restaurants } from '@prisma/client';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';
import { MenusModule } from './menus.module';
import { MenusService } from './menus.service';

describe('MenusService', () => {
  let service: MenusService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MenusModule, AppModule],
    }).compile();

    service = await module.resolve<MenusService>(MenusService);

    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.menus.deleteMany();
  });

  describe('findAll', () => {
    let restaurant: restaurants;
    let eggIndredient: ingredients;
    let milkIngredient: ingredients;

    // TODO: beforeAllでほんとはやりたい
    beforeEach(async () => {
      restaurant = await prisma.restaurants.findFirst();
      eggIndredient = await prisma.ingredients.findFirst({
        where: {
          name: '卵',
        },
      });
      milkIngredient = await prisma.ingredients.findFirst({
        where: {
          name: '乳',
        },
      });

      // メニューを作成
      await service.create({
        restaurantId: restaurant.id,
        menus: [
          {
            name: '卵を含む',
            pic: null,
            ingredientIds: [eggIndredient.id],
          },
          {
            name: '卵、乳を含む',
            pic: null,
            ingredientIds: [eggIndredient.id, milkIngredient.id],
          },
          {
            name: '卵、乳を含まない',
            pic: null,
            ingredientIds: [],
          },
        ],
      });
    });

    afterEach(async () => {
      await prisma.menus.deleteMany();
    });
    it('アレルギー情報が入力されるとそのアレルギー情報を含まないメニューを取得する', async () => {
      const data = await service.findAll({
        restaurantId: restaurant.id,
        ingredientIds: [eggIndredient.id],
      });

      expect(data.length).toBe(1);
    });

    it('アレルギー情報が複数入力されるとどのアレルギー情報も含まないメニューを取得する', async () => {
      const data = await service.findAll({
        restaurantId: restaurant.id,
        ingredientIds: [eggIndredient.id, milkIngredient.id],
      });

      expect(data.length).toBe(1);
      expect(data[0].name).toBe('卵、乳を含まない');
    });

    it('アレルギー情報が入力されないとすべてのメニューを取得する', async () => {
      const data = await service.findAll({
        restaurantId: restaurant.id,
        ingredientIds: [],
      });

      expect(data.length).toBe(3);
    });
  });

  it('メニューが作成できる', async () => {
    const restaurant = await prisma.restaurants.findFirst();
    const ingredient = await prisma.ingredients.findFirst();

    const data = await service.create({
      restaurantId: restaurant.id,
      menus: [
        {
          name: 'カレー',
          pic: null,
          ingredientIds: [ingredient.id],
        },
      ],
    });

    expect(data[0].name).toBe('カレー');
  });
});
