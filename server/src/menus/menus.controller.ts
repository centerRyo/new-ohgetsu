import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
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
  async findAll(@Query() query: findMenusQuery): Promise<MenuDto[]> {
    const menus = await this.menusService.findAll(query);

    return menus.map((menu) => new MenuDto(menu));
  }

  @Get(':id')
  @ApiOperation({
    summary: '指定されたメニューを取得する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: MenuDto })
  async findOne(@Param('id') id: string): Promise<MenuDto> {
    const menu = await this.menusService.findOne(id);

    return new MenuDto(menu);
  }

  @Post()
  @ApiOperation({
    summary: 'アレルギー情報を含んだメニューを作成する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [MenuDto] })
  @ApiBody({ type: CreateMenuDto })
  @UseInterceptors(AnyFilesInterceptor())
  async create(@Body() data: CreateMenuDto): Promise<MenuDto[]> {
    const menus = await this.menusService.create(data);

    return menus.map((menu) => new MenuDto(menu));
  }
}
