import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsUUID } from 'class-validator';
import { MenuDto } from './menus.dto';

class PartialMenuDto extends OmitType(MenuDto, ['id', 'ingredients']) {
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
