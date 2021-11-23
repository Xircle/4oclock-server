import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRepository } from '@review/repository/review.repository';
import { ReservationRepository } from '@reservation/repository/reservation.repository';
import { S3Service } from '@aws/s3/s3.service';
import { EventService } from '@event/event.service';
import { AuthModule } from '@auth/auth.module';
import { EventBannerRepository } from '@event/repositories/event-banner.repository';
import { User } from '@user/entities/user.entity';
import { PlaceDetailRepository } from './repository/place-detail.repository';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { PlaceRepository } from './repository/place.repository';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
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
