import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { CreateReviewInput } from './dtos/create-review.dto';
import { ReviewService } from './review.service';
import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Review')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  async createReview(
    @GetUser() authUser: User,
    @Body() createReviewInput: CreateReviewInput,
  ) {
    return this.reviewService.createReview(authUser, createReviewInput);
  }
}
