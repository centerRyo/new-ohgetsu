import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { UpdateRestaurantDto } from './update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async find(keyword?: string) {
    const restaurants = await this.prisma.restaurants.findMany({
      where: {
        deletedAt: null,
        ...(keyword
          ? {
              name: {
                contains: keyword,
              },
            }
          : {}),
      },
      include: {
        genre: true,
      },
    });

    return restaurants;
  }

  async findAll() {
    const restaurants = await this.prisma.restaurants.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        genre: true,
      },
    });

    return restaurants;
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurants.findFirst({
      where: { id },
      include: {
        genre: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async create(data: CreateRestaurantDto) {
    const restaurant = await this.prisma.restaurants.create({
      data,
    });

    return restaurant;
  }

  async update(id: string, data: UpdateRestaurantDto) {
    const { isReopen, ...rest } = data;
    const deletedAt = isReopen ? null : undefined;

    const restaurant = await this.prisma.restaurants.update({
      where: { id },
      data: {
        ...rest,
        deletedAt,
      },
    });

    return restaurant;
  }

  async delete(id: string) {
    return await this.prisma.restaurants.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async search(keyword: string) {
    const restaurants = await this.prisma.restaurants.findMany({
      where: {
        name: {
          contains: keyword,
        },
      },
    });

    return restaurants;
  }
}
