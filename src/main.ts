import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as logger from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import * as moment from 'moment';
import 'moment/locale/ko';
import { NextFunction, Request } from 'express';

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
  await app.listen(5000);
}
bootstrap();
