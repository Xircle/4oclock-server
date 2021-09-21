import { Module } from '@nestjs/common';
import { ReservationUtilService } from './reservation-util.service';

@Module({
  providers: [ReservationUtilService],
})
export class ReservationUtilModule {}
