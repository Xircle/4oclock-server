import { TeamRepository } from './../team/repository/team.repository';
import { PlaceRepository } from './../place/repository/place.repository';
import { Place } from './../place/entities/place.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { Reservation } from '@reservation/entities/reservation.entity';
import { S3Service } from '@aws/s3/s3.service';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ReservationRepository } from '@reservation/repository/reservation.repository';

@Global()
@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ReservationRepository,
      UserRepository,
      Reservation,
      Place,
      PlaceRepository,
      TeamRepository,
    ]),
  ],
  providers: [JwtAuthGuard, UserService, S3Service],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
