import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMenuDto } from './create-menu.dto';
import { findMenusQuery } from './menus.dto';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: findMenusQuery, restaurantId: string) {
    const menus = await this.prisma.menus.findMany({
      where: {
        restaurantId: restaurantId,
        ingredients: {
          none: {
            id: {
              in: query.ingredientIds,
            },
          },
        },
      },
      include: {
        ingredients: true,
      },
    });

    return menus;
  }

  async create(data: CreateMenuDto) {
    const restaurant = await this.prisma.restaurants.findUnique({
      where: {
        id: data.restaurantId,
      },
    });

    if (!restaurant) {
      throw new BadRequestException('Restaurant not found');
    }

    const menus = [];

    for (const menu of data.menus) {
      const { name, pic, ingredients } = menu;

      const validatedIngredients = [];

      for (const ingredient of ingredients) {
        const existingIngredient = await this.prisma.ingredients.findUnique({
          where: {
            id: ingredient.id,
          },
        });

        if (!existingIngredient) {
          throw new BadRequestException('Ingredient not found');
        }

        validatedIngredients.push({ id: existingIngredient.id });
      }

      const createdMenu = await this.prisma.menus.create({
        data: {
          name,
          pic,
          restaurant: {
            connect: {
              id: restaurant.id,
            },
          },
          ingredients: {
            connect: validatedIngredients,
          },
        },
        include: {
          ingredients: true,
        },
      });

      menus.push(createdMenu);
    }

    return menus;
  }
}
