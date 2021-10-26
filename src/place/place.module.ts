import { PlaceDetailRepository } from './repository/place-detail.repository';
import { EventBannerRepository } from './../event/repositories/event-banner.repository';
import { AuthModule } from './../auth/auth.module';
import { Review } from 'src/review/entities/review.entity';
import { ReservationUtilService } from './../utils/reservation/reservation-util.service';
import { ConfigService } from '@nestjs/config';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './../user/entities/user.entity';
import { S3Service } from 'src/aws/s3/s3.service';
import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { EventService } from 'src/event/event.service';
import { PlaceRepository } from './repository/place.repository';
import { ReviewRepository } from 'src/review/repository/review.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      PlaceRepository,
      ReviewRepository,
      EventBannerRepository,
      PlaceDetailRepository,
      Reservation,
      User,
    ]),
  ],
  providers: [
    PlaceService,
    S3Service,
    ReservationUtilService,
    CurrentUserInterceptor,
    ConfigService,
    EventService,
  ],
  controllers: [PlaceController],
})
export class PlaceModule {}
