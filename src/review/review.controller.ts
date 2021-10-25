import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { CreateReviewInput } from './dtos/create-review.dto';
import { ReviewService } from './review.service';
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Review')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('reviewImages'))
  @ApiOperation({ summary: '리뷰 생성하기' })
  async createReview(
    @GetUser() authUser: User,
    @Body() createReviewInput: CreateReviewInput,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.reviewService.createReview(authUser, createReviewInput, files);
  }
}
