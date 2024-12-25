import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SearchRestaurantsDto {
  @Expose()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: '検索キーワード', required: false })
  search_query?: string;
}
