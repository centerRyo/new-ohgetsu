import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class IngredientDto {
  @Expose()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  pic: string;
}
