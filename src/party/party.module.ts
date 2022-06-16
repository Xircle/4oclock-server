import { PartyRepository } from './repositories/party.repository';
import { PlaceDetailRepository } from './../place/repository/place-detail.repository';
import { PlaceRepository } from './../place/repository/place.repository';
import { PlaceService } from '@place/place.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from '@aws/s3/s3.service';
import { AuthModule } from '@auth/auth.module';
import { ReservationRepository } from '@reservation/repository/reservation.repository';
import { User } from '@user/entities/user.entity';
import { CurrentUserInterceptor } from './../place/interceptors/current-user.interceptor';
import { ConfigService } from '@nestjs/config';
import { ReservationService } from '@reservation/reservation.service';
import { NotificationService } from 'notification/notification.service';
import { Module } from '@nestjs/common';
import { PartyService } from './party.service';
import { PartyController } from './party.controller';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([PartyRepository, User])],
  providers: [
    PartyService,
    S3Service,
    CurrentUserInterceptor,
    ConfigService,
    NotificationService,
  ],
  controllers: [PartyController],
  exports: [PartyService],
})
export class PartyModule {}
