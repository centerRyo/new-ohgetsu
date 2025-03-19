import { PartialType } from '@nestjs/swagger';
import { PartialMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(PartialMenuDto) {}
