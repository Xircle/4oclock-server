import * as Joi from 'joi';
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { S3Module } from '@aws/s3/s3.module';
import { PlaceModule } from '@place/place.module';
import { ReservationModule } from '@reservation/reservation.module';
import { RoomModule } from '@room/room.module';
import { MessageModule } from '@message/message.module';
import { ReviewModule } from '@review/review.module';
import { ChatsModule } from '@chats/chats.module';
import { AdminModule } from '@admin/admin.module';
import { EventModule } from '@event/event.module';
import { HealthModule } from '@health/health.module';
import { SmsModule } from './sms/sms.module';
import { TeamModule } from './team/team.module';
import ormconfig from '../ormconfig';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notification/notification.module';
import { PartyModule } from './party/party.module';
import { ApplicationModule } from './application/application.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'prod', 'test')
          .default('dev')
          .required(),
        RDS_HOSTNAME: Joi.string().required(),
        RDS_DB_NAME: Joi.string().required(),
        RDS_USERNAME: Joi.string().required(),
        RDS_PASSWORD: Joi.string().required(),
        RDS_PORT: Joi.number(),
        KAKAO_ID: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
        AWS_ACCESS_KEY: Joi.string().required(),
        AWS_SECRET_KEY: Joi.string().required(),
        ADMIN_ACCESS_PASSWORD: Joi.string().required(),
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        TWILIO_VERIFICATION_SERVICE_SID: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'dev'
          ? '.env.dev'
          : process.env.NODE_ENV === 'prod'
          ? '.env.prod'
          : '.env.test',
    }),
    TypeOrmModule.forRoot(ormconfig),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    S3Module,
    PlaceModule,
    ReservationModule,
    RoomModule,
    MessageModule,
    ReviewModule,
    ChatsModule,
    AdminModule,
    EventModule,
    HealthModule,
    SmsModule,
    TeamModule,
    NotificationModule,
    PartyModule,
    ApplicationModule,
    CategoryModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
