import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './repository/reservation.repository';
import { AuthModule } from '@auth/auth.module';
import { PlaceModule } from '@place/place.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationRepository]),
    AuthModule,
    PlaceModule,
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
  exports: [ReservationService],
})
export class ReservationModule {}
