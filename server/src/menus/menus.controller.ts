import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { MenuDto, findMenusQuery } from './menus.dto';
import { MenusService } from './menus.service';

@Controller('menus')
@ApiTags('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  @ApiOperation({
    summary: '指定されたアレルギー情報を含まないメニュー一覧を取得する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [MenuDto] })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        resutaurantId: {
          type: 'string',
          description: 'レストランID',
        },
      },
      required: ['resutaurantId'],
    },
  })
  async findAll(
    @Query() query: findMenusQuery,
    @Body('restaurantId') resutaurantId: string
  ): Promise<MenuDto[]> {
    const menus = await this.menusService.findAll(query, resutaurantId);

    return menus.map((menu) => new MenuDto(menu));
  }

  @Post()
  @ApiOperation({
    summary: 'アレルギー情報を含んだメニューを作成する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [MenuDto] })
  @ApiBody({ type: CreateMenuDto })
  async create(@Body() data: CreateMenuDto): Promise<MenuDto[]> {
    const menus = await this.menusService.create(data);

    return menus.map((menu) => new MenuDto(menu));
  }
}
