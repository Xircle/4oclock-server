import { AuthModule } from './../auth/auth.module';
import { Place } from 'src/place/entities/place.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { S3Service } from 'src/aws/s3/s3.service';
import { ReviewRepository } from './repository/review.repository';
import { PlaceModule } from 'src/place/place.module';

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
