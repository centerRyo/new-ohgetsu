import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateMenuDto {
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
  @IsOptional()
  @ApiProperty({
    description: '写真',
    type: 'string',
    format: 'binary',
    required: false,
  })
  pic?: string;

  /**
   * 備考
   */
  @Expose()
  @IsOptional()
  @ApiProperty({
    description: '備考',
    type: 'string',
    required: false,
  })
  note?: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  @Transform(({ value }) => {
    if (typeof value === 'string') return JSON.parse(value);

    return [];
  })
  ingredientIds: string[];
}
