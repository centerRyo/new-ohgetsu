import { IsUUID } from 'class-validator';
import { MenuDto } from './menus.dto';
import { Expose } from 'class-transformer';

export class CreateMenuDto {
  /**
   * レストランID
   */
  @Expose()
  @IsUUID()
  restaurantId: string;

  /**
   * メニュー
   */
  @Expose()
  menus: Omit<MenuDto, 'id'>[];
}
