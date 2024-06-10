import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GenresModule } from './genres/genres.module';
import { GlobalModule } from './global.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { MenusModule } from './menus/menus.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
    GlobalModule,
    IngredientsModule,
    GenresModule,
    RestaurantsModule,
    MenusModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
