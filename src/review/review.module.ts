import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './repository/review.repository';
import { Place } from '@place/entities/place.entity';
import { PlaceModule } from '@place/place.module';
import { S3Service } from '@aws/s3/s3.service';
import { AuthModule } from '@auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewRepository, Place]),
    AuthModule,
    PlaceModule,
  ],
  providers: [ReviewService, S3Service],
  controllers: [ReviewController],
})
export class ReviewModule {}
