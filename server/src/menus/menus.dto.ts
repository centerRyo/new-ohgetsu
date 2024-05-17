import { Expose } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { IngredientDto } from 'src/ingredients/ingredients.dto';

export class MenuDto {
  constructor(partial: Partial<MenuDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @IsUUID()
  id: string;

  /**
   * メニュー名
   */
  @Expose()
  name: string;

  /**
   * 写真
   */
  @Expose()
  @IsString()
  @IsOptional()
  pic: string | null;

  /**
   * アレルギー情報
   */
  @Expose()
  ingredients: IngredientDto[];
}

export class findMenusQuery {
  /**
   * アレルギー情報のID
   */
  @Expose()
  @IsArray()
  ingredientIds: string[];
}
