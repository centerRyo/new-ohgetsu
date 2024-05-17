import { genres } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class RestaurantDto {
  constructor(partial: Partial<RestaurantDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @IsUUID()
  id: string;

  /**
   * レストラン名
   */
  @Expose()
  @IsString()
  name: string;

  /**
   * レストランの画像URL
   */
  @Expose()
  @IsString()
  pic: string;

  /**
   * ジャンル
   */
  @Expose()
  genre: genres;
}
