import { PlaceUtilService } from './../utils/place/place-util.service';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { User } from './entities/user.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Reservation])],
  providers: [UserService, PlaceUtilService],
  controllers: [UserController],
})
export class UserModule {}
