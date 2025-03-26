import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

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

  /**
   * 営業開始するかどうか
   */
  @Expose()
  @IsBoolean()
  // multipart/form-dataとして受け付けるのでstringをbooleanに変換する必要がある
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty({ description: '営業開始フラグ' })
  isOpen: boolean;
}
