import { Module } from '@nestjs/common';
import { S3Service } from '../common/services/s3.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService, S3Service],
})
export class RestaurantsModule {}
