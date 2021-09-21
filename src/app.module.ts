import { config } from 'dotenv';
config();
import { Reservation } from './reservation/entities/reservation.entity';
import { PlaceDetail } from './place/entities/place-detail.entity';
import { Place } from './place/entities/place.entity';
import { S3Module } from './aws/s3/s3.module';
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

console.log(process.env.DATABASE_URL);
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      type: 'postgres',
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
