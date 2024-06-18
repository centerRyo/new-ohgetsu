import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMenuDto } from './create-menu.dto';
import { MenuDto, findMenusQuery } from './menus.dto';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: findMenusQuery) {
    const ingredientIds = Array.isArray(query.ingredientIds)
      ? query.ingredientIds
      : [query.ingredientIds];
    const menus = await this.prisma.menus.findMany({
      where: {
        restaurantId: query.restaurantId,
        ingredients: query.ingredientIds
          ? {
              none: {
                id: {
                  in: ingredientIds,
                },
              },
            }
          : undefined,
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

    const menus: MenuDto[] = [];

    for (const menu of data.menus) {
      const { name, pic, ingredientIds } = menu;

      const validatedIngredients = [];

      for (const ingredientId of ingredientIds) {
        const existingIngredient = await this.prisma.ingredients.findUnique({
          where: {
            id: ingredientId,
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
