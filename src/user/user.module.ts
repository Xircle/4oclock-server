import { AuthModule } from './../auth/auth.module';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { S3Service } from './../aws/s3/s3.service';
import { UserRepository } from './repositories/user.repository';
import { PlaceUtilService } from './../utils/place/place-util.service';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { CacheModule, Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    CacheModule.register(),
    AuthModule,
    TypeOrmModule.forFeature([UserRepository, Reservation]),
  ],
  providers: [JwtAuthGuard, UserService, PlaceUtilService, S3Service],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
