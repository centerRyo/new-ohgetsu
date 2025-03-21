import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Readable } from 'stream';
import { S3Service } from '../common/services/s3.service';
import { PrismaService } from '../prisma.service';
import { CreateMenuDto } from './create-menu.dto';
import { MenuDto, findMenusQuery } from './menus.dto';
import { UpdateMenuDto } from './update-menu.dto';

@Injectable()
export class MenusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service
  ) {}

  async findAll(query: findMenusQuery) {
    const { restaurantId, ingredientIds } = query;

    const excludeIngredientIds = ingredientIds
      ? Array.isArray(ingredientIds)
        ? ingredientIds
        : [ingredientIds]
      : [];

    const menus = await this.prisma.menus.findMany({
      where: {
        restaurantId,
        ingredients: ingredientIds
          ? {
              none: {
                id: {
                  in: excludeIngredientIds,
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

  async findOne(id: string) {
    const menu = await this.prisma.menus.findUnique({
      where: {
        id,
      },
      include: {
        ingredients: true,
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu ${id} not found`);
    }

    return menu;
  }

  async create(data: CreateMenuDto) {
    const restaurant = await this.prisma.restaurants.findUnique({
      where: {
        id: data.restaurantId,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
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
          throw new NotFoundException('Ingredient not found');
        }

        validatedIngredients.push({ id: existingIngredient.id });
      }

      let uploadedPic: string | null = null;

      if (pic) {
        // picは"data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."のような形で送られてくる
        const base64Data = pic.split(';base64,').pop();
        const contentType = pic.substring(5, pic.indexOf(';'));
        const buffer = Buffer.from(base64Data, 'base64');

        const uploadFile: Express.Multer.File = {
          fieldname: 'pic',
          originalname: `${Date.now()}-${name.replace(/\s+/g, '_')}.png`,
          encoding: '7bit',
          buffer,
          mimetype: contentType,
          size: buffer.length,
          stream: Readable.from(buffer),
          destination: '',
          filename: '',
          path: '',
        };

        try {
          uploadedPic = await this.s3Service.uploadFile({
            file: uploadFile,
            folder: 'menus',
          });
        } catch (error) {
          throw new InternalServerErrorException(
            `さくらのクラウドオブジェクトストレージへのファイルアップロードに失敗しました: ${error}`
          );
        }
      }

      const createdMenu = await this.prisma.menus.create({
        data: {
          name,
          pic: uploadedPic,
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

  async update(id: string, data: UpdateMenuDto, pic: Express.Multer.File) {
    const existing = await this.prisma.menus.findFirst({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Menu not found');
    }

    const picPath = pic
      ? await this.s3Service.uploadFile({ file: pic, folder: 'menu' })
      : existing.pic;

    const validatedIngredients = await Promise.all(
      data.ingredientIds.map(async (id) => {
        const exists = await this.prisma.ingredients.findUnique({
          where: { id },
        });

        if (!exists) {
          throw new NotFoundException(`Ingredient ${id} not found`);
        }

        return { id: exists.id };
      })
    );

    const menu = await this.prisma.menus.update({
      where: { id },
      data: {
        name: data.name,
        pic: picPath,
        ingredients: {
          set: validatedIngredients,
        },
      },
    });

    return menu;
  }
}
