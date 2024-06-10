import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';
import { GenreDto } from 'src/genres/genres.dto';

export class RestaurantDto {
  constructor(partial: Partial<RestaurantDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @IsUUID()
  @ApiProperty({ description: 'レストランID' })
  id: string;

  /**
   * レストラン名
   */
  @Expose()
  @IsString()
  @ApiProperty({ description: 'レストラン名' })
  name: string;

  /**
   * 住所
   */
  @Expose()
  @ApiProperty({ description: '住所', required: false })
  address?: string;

  /**
   * レストランの画像URL
   */
  @Expose()
  @IsString()
  @ApiProperty({ description: 'レストランの画像URL' })
  pic: string;

  /**
   * ジャンル
   */
  @Expose()
  @ApiProperty({ description: 'ジャンル', type: GenreDto })
  genre: GenreDto;
}
