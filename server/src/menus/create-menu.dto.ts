import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class PartialMenuDto {
  /**
   * メニュー名
   */
  @Expose()
  @ApiProperty()
  name: string;

  /**
   * 写真
   */
  @Expose()
  @IsOptional()
  @ApiProperty({
    description: '写真',
    type: 'string',
    format: 'byte',
    required: false,
  })
  pic?: string;

  @Expose()
  @IsArray()
  @ApiProperty({ type: [String] })
  ingredientIds: string[];
}

export class CreateMenuDto {
  /**
   * レストランID
   */
  @Expose()
  @IsUUID()
  @ApiProperty()
  restaurantId: string;

  /**
   * メニュー
   */
  @Expose()
  @ApiProperty({ type: [PartialMenuDto] })
  menus: PartialMenuDto[];
}
