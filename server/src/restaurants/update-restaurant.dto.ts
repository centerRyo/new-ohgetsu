import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  /**
   * レストラン再開フラグ
   */
  @Expose()
  @IsBoolean()
  isReopen?: boolean;
}
