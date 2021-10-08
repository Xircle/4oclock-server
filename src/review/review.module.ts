import { Review } from 'src/review/entities/review.entity';
import { Place } from 'src/place/entities/place.entity';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Place]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
