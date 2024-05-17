import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRestaurantDto {
  /**
   * レストラン名
   */
  @IsString()
  name: string;

  /**
   * 住所
   */
  @IsString()
  @IsOptional()
  address?: string;

  /**
   * 写真
   */
  @IsString()
  @IsOptional()
  pic?: string;

  /**
   * ジャンルID
   */
  @IsUUID()
  genreId: string;
}
