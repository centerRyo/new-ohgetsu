import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class GenreDto {
  @Expose()
  id: string;

  @Expose()
  @IsString()
  name: string;
}
