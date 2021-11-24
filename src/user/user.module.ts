import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, Global, Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { Reservation } from '@reservation/entities/reservation.entity';
import { S3Service } from '@aws/s3/s3.service';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Global()
@Module({
  imports: [
    CacheModule.register(),
    AuthModule,
    TypeOrmModule.forFeature([UserRepository, Reservation]),
  ],
  providers: [JwtAuthGuard, UserService, S3Service],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
