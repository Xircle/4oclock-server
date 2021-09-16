import { Reservation } from './reservation/entities/reservation.entity';
import { PlaceDetail } from './place/entities/place-detail.entity';
import { Place } from './place/entities/place.entity';
import { S3Module } from './aws/s3/S3.module';
import { User } from './user/entities/user.entity';
import { UserProfile } from './user/entities/user-profile.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceModule } from './place/place.module';
import { ReservationModule } from './reservation/reservation.module';
import SocialAccount from './user/entities/social-account.entity';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        DB_PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        KAKAO_ID: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
        AWS_ACCESS_KEY: Joi.string().required(),
        AWS_SECRET_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      cache: {
        duration: 6000,
      },
      entities: [
        User,
        UserProfile,
        SocialAccount,
        Place,
        PlaceDetail,
        Reservation,
      ],
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.NODE_ENV !== 'prod',
    }),
    UserModule,
    AuthModule,
    S3Module,
    PlaceModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
