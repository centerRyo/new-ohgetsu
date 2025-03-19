import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { MenuDto, findMenusQuery } from './menus.dto';
import { MenusService } from './menus.service';
import { UpdateMenuDto } from './update-menu.dto';

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

  @Patch(':id')
  @ApiOperation({
    summary: 'メニューを更新する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: MenuDto })
  @ApiBody({ type: UpdateMenuDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('pic'))
  async update(
    @Param('id') id: string,
    @Body() data: UpdateMenuDto,
    @UploadedFile() pic?: Express.Multer.File
  ): Promise<MenuDto> {
    const menu = await this.menusService.update(id, data, pic);

    return new MenuDto(menu);
  }
}
