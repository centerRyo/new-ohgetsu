import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { RestaurantDto } from './restaurants.dto';
import { RestaurantsService } from './restaurants.service';
import { SearchRestaurantsDto } from './search-restaurants.dto';
import { UpdateRestaurantDto } from './update-restaurant.dto';

@Injectable()
@Controller('restaurants')
@ApiTags('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({
    summary: 'レストラン一覧を取得する',
    description:
      '検索キーワードがある場合、レストラン名で部分一致検索を行う。ない場合は全件取得する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [RestaurantDto] })
  async find(@Query() query: SearchRestaurantsDto): Promise<RestaurantDto[]> {
    const restaurants = await this.restaurantsService.find({ ...query });

    return restaurants.map((restaurant) => new RestaurantDto(restaurant));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'レストランを取得する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: RestaurantDto })
  async findOne(@Param('id') id: string): Promise<RestaurantDto> {
    const restaurant = await this.restaurantsService.findOne(id);

    return new RestaurantDto(restaurant);
  }

  @Post()
  @ApiOperation({
    summary: 'レストランを作成する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: RestaurantDto })
  @ApiBody({
    type: CreateRestaurantDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('pic'))
  async create(
    @Body() data: CreateRestaurantDto,
    @UploadedFile() pic?: Express.Multer.File
  ): Promise<RestaurantDto> {
    const restaurant = await this.restaurantsService.create(data, pic);

    return new RestaurantDto(restaurant);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'レストランを更新する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: RestaurantDto })
  @ApiBody({
    type: UpdateRestaurantDto,
  })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateRestaurantDto
  ): Promise<RestaurantDto> {
    const restaurant = await this.restaurantsService.update(id, data);

    return new RestaurantDto(restaurant);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'レストランを削除(営業停止)する',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'object', properties: { result: { type: 'boolean' } } },
  })
  async delete(@Param('id') id: string) {
    await this.restaurantsService.delete(id);

    return { result: true };
  }
}
