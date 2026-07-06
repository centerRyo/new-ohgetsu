import { Module } from '@nestjs/common';
import { S3Service } from '../common/services/s3.service';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { PdfParseService } from './pdf-parse.service';

@Module({
  controllers: [MenusController],
  providers: [MenusService, S3Service, PdfParseService],
})
export class MenusModule {}
