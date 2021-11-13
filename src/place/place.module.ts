import { PlaceDetailRepository } from './repository/place-detail.repository';
import { EventBannerRepository } from './../event/repositories/event-banner.repository';
import { AuthModule } from './../auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './../user/entities/user.entity';
import { S3Service } from 'src/aws/s3/s3.service';
import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from 'src/event/event.service';
import { PlaceRepository } from './repository/place.repository';
import { ReviewRepository } from 'src/review/repository/review.repository';
import { ReservationRepository } from 'src/reservation/repository/reservation.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      PlaceRepository,
      ReviewRepository,
      EventBannerRepository,
      PlaceDetailRepository,
      ReservationRepository,
      User,
    ]),
  ],
  providers: [
    PlaceService,
    S3Service,
    CurrentUserInterceptor,
    ConfigService,
    EventService,
  ],
  controllers: [PlaceController],
  exports: [PlaceService],
})
export class PlaceModule {}
