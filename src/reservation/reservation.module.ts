import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './repository/reservation.repository';
import { AuthModule } from '@auth/auth.module';
import { PlaceModule } from '@place/place.module';
import { NotificationService } from 'notification/notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationRepository]),
    AuthModule,
    PlaceModule,
  ],
  providers: [ReservationService, NotificationService],
  controllers: [ReservationController],
  exports: [ReservationService],
})
export class ReservationModule {}
