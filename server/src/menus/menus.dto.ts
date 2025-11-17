import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { IngredientDto } from '../ingredients/ingredients.dto';

export class MenuDto {
  constructor(partial: Partial<MenuDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @IsUUID()
  @ApiProperty()
  id: string;

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
  @IsString()
  @IsOptional()
  @ApiProperty()
  pic: string | null;

  /**
   * 備考
   */
  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  note: string | null;

  /**
   * アレルギー情報
   */
  @Expose()
  @ApiProperty({ type: [IngredientDto] })
  ingredients: IngredientDto[];
}

export class findMenusQuery {
  /**
   * アレルギー情報のID
   */
  @Expose()
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({
    description: 'アレルギー情報のID',
    type: [String],
    required: false,
  })
  ingredientIds?: string | string[];

  /**
   * レストランID
   */
  @Expose()
  @IsUUID()
  @ApiProperty()
  restaurantId: string;
}
