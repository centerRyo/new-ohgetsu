import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRestaurantDto {
  /**
   * レストラン名
   */
  @Expose()
  @IsString()
  @ApiProperty({ description: 'レストラン名' })
  name: string;

  /**
   * 写真
   */
  @Expose()
  @IsOptional()
  @ApiProperty({
    description: '写真',
    type: 'string',
    format: 'binary',
    required: false,
  })
  pic?: string;

  /**
   * ジャンルID
   */
  @Expose()
  @IsUUID()
  @ApiProperty({ description: 'ジャンルID' })
  genreId: string;
}
