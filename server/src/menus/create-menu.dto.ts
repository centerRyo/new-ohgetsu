import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { MenuDto } from './menus.dto';

class PartialMenuDto extends OmitType(MenuDto, ['id']) {}

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
