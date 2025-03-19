import { Test, TestingModule } from '@nestjs/testing';
import { ingredients, restaurants } from '@prisma/client';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';
import { MenusModule } from './menus.module';
import { MenusService } from './menus.service';

describe('MenusService', () => {
  let service: MenusService;
  let prisma: PrismaService;

  let restaurant: restaurants;
  let ingredient1: ingredients;
  let ingredient2: ingredients;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MenusModule, AppModule],
    }).compile();

    service = await module.resolve<MenusService>(MenusService);

    prisma = module.get<PrismaService>(PrismaService);

    const genre = await prisma.genres.create({
      data: {
        name: 'test genre',
      },
    });

    restaurant = await prisma.restaurants.create({
      data: {
        name: 'test restaurant',
        genreId: genre.id,
      },
    });

    ingredient1 = await prisma.ingredients.create({
      data: {
        name: 'ingredient1',
        pic: 'pic1',
      },
    });

    ingredient2 = await prisma.ingredients.create({
      data: {
        name: 'ingredient2',
        pic: 'pic2',
      },
    });
  });

  afterAll(async () => {
    await prisma.menus.deleteMany();
    await prisma.restaurants.deleteMany();
    await prisma.genres.deleteMany();
    await prisma.ingredients.deleteMany();
  });

  describe('findAll', () => {
    beforeAll(async () => {
      // メニューを作成
      await service.create({
        restaurantId: restaurant.id,
        menus: [
          {
            name: 'ingredient1を含む',
            pic: null,
            ingredientIds: [ingredient1.id],
          },
          {
            name: 'ingredient1、ingredient2を含む',
            pic: null,
            ingredientIds: [ingredient1.id, ingredient2.id],
          },
          {
            name: 'ingredient1、ingredient2を含まない',
            pic: null,
            ingredientIds: [],
          },
        ],
      });
    });

    it('アレルギー情報が入力されるとそのアレルギー情報を含まないメニューを取得する', async () => {
      const data = await service.findAll({
        restaurantId: restaurant.id,
        ingredientIds: [ingredient1.id],
      });

      expect(data.length).toBe(1);
    });

    it('アレルギー情報が複数入力されるとどのアレルギー情報も含まないメニューを取得する', async () => {
      const data = await service.findAll({
        restaurantId: restaurant.id,
        ingredientIds: [ingredient1.id, ingredient2.id],
      });

      expect(data.length).toBe(1);
      expect(data[0].name).toBe('ingredient1、ingredient2を含まない');
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

  describe('update', () => {
    it('メニューを更新できる', async () => {
      const menu = await service.create({
        restaurantId: restaurant.id,
        menus: [
          {
            name: 'カレー',
            pic: null,
            ingredientIds: [ingredient1.id],
          },
        ],
      });

      const updatedMenu = await service.update(
        menu[0].id,
        { name: 'カツカレー' },
        undefined
      );

      expect(updatedMenu.name).toBe('カツカレー');
    });
  });
});
