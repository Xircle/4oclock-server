import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
