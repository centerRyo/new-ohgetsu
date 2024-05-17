import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantDto } from './restaurants.dto';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { UpdateRestaurantDto } from './update-restaurant.dto';

@Injectable()
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}
  @Get()
  async findAll(): Promise<RestaurantDto[]> {
    const restaurants = await this.restaurantsService.findAll();

    return restaurants.map((restaurant) => new RestaurantDto(restaurant));
  }

  @Post()
  async create(@Body() data: CreateRestaurantDto): Promise<RestaurantDto> {
    const restaurant = await this.restaurantsService.create(data);

    return new RestaurantDto(restaurant);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateRestaurantDto,
  ): Promise<RestaurantDto> {
    const restaurant = await this.restaurantsService.update(id, data);

    return new RestaurantDto(restaurant);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.restaurantsService.delete(id);

    return { result: true };
  }
}
