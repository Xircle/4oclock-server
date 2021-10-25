import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { CreateReviewInput } from './dtos/create-review.dto';
import { ReviewService } from './review.service';
import {
  Controller,
  UseGuards,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
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
import { GetReviewById } from './dtos/get-review-by-id.dto';

@ApiTags('Review')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: '리뷰 최신순으로 보기' })
  async getAllReviews(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.reviewService.getAllReviews(page, limit);
  }

  @Get(':reviewId')
  @ApiOperation({ summary: '리뷰 최신순으로 보기' })
  async getReviewById(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ): Promise<GetReviewById> {
    return this.reviewService.getReviewById(reviewId);
  }

  @Post('place/:placeId')
  @UseInterceptors(FilesInterceptor('reviewImages'))
  @ApiOperation({ summary: '리뷰 생성하기' })
  async createReview(
    @GetUser() authUser: User,
    @Param('placeId', ParseUUIDPipe) placeId: string,
    @Body() createReviewInput: CreateReviewInput,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.reviewService.createReview(
      authUser,
      placeId,
      createReviewInput,
      files,
    );
  }
}
