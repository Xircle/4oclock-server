import { PlaceUtilService } from './../utils/place/place-util.service';
import { ReservationService } from './../reservation/reservation.service';
import { PassportModule } from '@nestjs/passport';
import { S3Service } from 'src/aws/s3/s3.service';
import { PlaceDetail } from './entities/place-detail.entity';
import { Place } from './entities/place.entity';
import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Place, PlaceDetail, Reservation]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  providers: [PlaceService, PlaceUtilService, S3Service, ReservationService],
  controllers: [PlaceController],
})
export class PlaceModule {}
