import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Service } from '../common/services/s3.service';
import { PrismaService } from '../prisma.service';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { UpdateRestaurantDto } from './update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service
  ) {}

  async find({
    keyword,
    withDeleted,
  }: {
    keyword?: string;
    withDeleted?: boolean;
  }) {
    const restaurants = await this.prisma.restaurants.findMany({
      where: {
        deletedAt: withDeleted ? undefined : null,
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

  async create(data: CreateRestaurantDto, pic: Express.Multer.File | null) {
    // picがあればさくらのクラウドオブジェクトストレージにアップロード
    const picPath = pic
      ? await this.s3Service.uploadFile({ file: pic, folder: 'restaurants' })
      : null;

    const { isOpen, ...rest } = data;

    const restaurant = await this.prisma.restaurants.create({
      data: {
        ...rest,
        pic: picPath,
        deletedAt: isOpen ? null : new Date(),
      },
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
