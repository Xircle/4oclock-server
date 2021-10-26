import { AuthModule } from './../auth/auth.module';
import { Reservation } from './entities/reservation.entity';
import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceModule } from 'src/place/place.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), AuthModule, PlaceModule],
  providers: [ReservationService],
  controllers: [ReservationController],
  exports: [ReservationService],
})
export class ReservationModule {}
