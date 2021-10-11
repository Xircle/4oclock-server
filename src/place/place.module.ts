import { Review } from 'src/review/entities/review.entity';
import { ReservationUtilService } from './../utils/reservation/reservation-util.service';
import { ConfigService } from '@nestjs/config';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './../user/entities/user.entity';
import { PlaceUtilService } from './../utils/place/place-util.service';
import { S3Service } from 'src/aws/s3/s3.service';
import { PlaceDetail } from './entities/place-detail.entity';
import { Place } from './entities/place.entity';
import { CacheModule, Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Module({
  imports: [
    CacheModule.register({ ttl: 10 }),
    TypeOrmModule.forFeature([Place, PlaceDetail, Reservation, User, Review]),
  ],
  providers: [
    PlaceService,
    PlaceUtilService,
    S3Service,
    ReservationUtilService,
    CurrentUserInterceptor,
    ConfigService,
  ],
  controllers: [PlaceController],
})
export class PlaceModule {}
