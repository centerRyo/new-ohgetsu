import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { MenusService } from './menus.service';
import { MenuDto, findMenusQuery } from './menus.dto';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  @ApiOperation({
    summary: '指定されたアレルギー情報を含まないメニュー一覧を取得する',
  })
  async findAll(
    @Query() query: findMenusQuery,
    @Body('restaurantId') resutaurantId: string,
  ): Promise<MenuDto[]> {
    const menus = await this.menusService.findAll(query, resutaurantId);

    return menus;
  }

  @Post()
  @ApiOperation({
    summary: 'アレルギー情報を含んだメニューを作成する',
  })
  async create(@Body() data: CreateMenuDto) {
    const menus = await this.menusService.create(data);

    return menus;
  }
}
