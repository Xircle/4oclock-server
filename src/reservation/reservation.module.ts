import { User } from './../user/entities/user.entity';
import { JwtStrategy } from './../auth/jwt.strategy';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Place } from './../place/entities/place.entity';
import { Reservation } from './entities/reservation.entity';
import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Place]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
  exports: [ReservationService],
})
export class ReservationModule {}
