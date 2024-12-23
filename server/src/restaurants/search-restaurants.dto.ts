import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class SearchRestaurantsDto {
  @Expose()
  @IsString()
  @ApiProperty({ description: '検索キーワード' })
  search_query: string;
}
