import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SearchRestaurantsDto {
  @Expose()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: '検索キーワード', required: false })
  search_query?: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: '営業停止中も含むかどうか',
    required: false,
  })
  // クエリパラメーターではstringになるのでbooleanに変換
  @Transform(({ value }) => value === 'true' || value === true)
  withDeleted?: boolean;
}
