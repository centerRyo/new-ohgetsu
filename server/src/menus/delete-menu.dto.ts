import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class DeleteMenuDto {
  constructor(partial: Partial<DeleteMenuDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  result: boolean;
}
