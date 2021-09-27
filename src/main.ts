import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as logger from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger('dev'));
  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // const config = new DocumentBuilder()
  //   .setTitle('네시모해 API')
  //   .setDescription('네시모해 개발을 위한 API 문서입니다.')
  //   .setVersion('1.0')
  //   .addBearerAuth(
  //     {
  //       type: 'http',
  //       scheme: 'bearer',
  //       bearerFormat: 'JWT',
  //     },
  //     'jwt',
  //   )
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SERVER_PORT || 3080);
}
bootstrap();
