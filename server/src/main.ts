import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Body Parserのサイズ制限を増やすことで
  // 大きなファイルがリクエストにある場合でも受け付けるようにする
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 8080;

  // swagger
  const config = new DocumentBuilder()
    .setTitle('ohgetsu API')
    .setDescription('ohgetsu API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
