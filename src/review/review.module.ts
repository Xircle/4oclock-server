import { AuthModule } from './../auth/auth.module';
import { Review } from 'src/review/entities/review.entity';
import { Place } from 'src/place/entities/place.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { S3Service } from 'src/aws/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Place]), AuthModule],
  providers: [ReviewService, S3Service],
  controllers: [ReviewController],
})
export class ReviewModule {}
