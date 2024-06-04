import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateRestaurantDto } from './create-restaurant.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  /**
   * レストラン再開フラグ
   */
  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'レストラン再開フラグ' })
  isReopen?: boolean;
}
