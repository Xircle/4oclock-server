import { S3Service } from './../aws/s3/s3.service';
import { UserRepository } from './repositories/user.repository';
import { PlaceUtilService } from './../utils/place/place-util.service';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, Reservation])],
  providers: [UserService, PlaceUtilService, S3Service],
  controllers: [UserController],
})
export class UserModule {}
