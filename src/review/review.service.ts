import { PlaceService } from './../place/place.service';
import { CreateReviewInput } from './dtos/create-review.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetAllReviewsOutput } from './dtos/get-all-reviews.dto';
import { GetReviewById } from './dtos/get-review-by-id.dto';
import { ReviewRepository } from './repository/review.repository';
import { S3Service } from '@aws/s3/s3.service';
import { User } from '@user/entities/user.entity';
import { CoreOutput } from '@common/common.interface';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly placeService: PlaceService,
    private readonly s3Service: S3Service,
  ) {}

  public async getAllReviews(
    page: number,
    limit: number,
  ): Promise<GetAllReviewsOutput> {
    try {
      const reviews = await this.reviewRepository.find({
        order: {
          createdAt: 'DESC',
        },
        take: limit,
        skip: limit * (page - 1),
      });
      return {
        ok: true,
        reviews,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  public async getReviewById(reviewId: string): Promise<GetReviewById> {
    try {
      const review = await this.reviewRepository.findReviewById(reviewId, {
        relations: ['user', 'place'],
      });
      if (!review) {
        return {
          ok: false,
          error: '리뷰가 존재하지 않습니다.',
        };
      }
      return {
        ok: true,
        review,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  public async createReview(
    authUser: User,
    placeId: string,
    { description }: CreateReviewInput,
    files: Express.Multer.File[],
  ): Promise<CoreOutput> {
    try {
      await this.placeService.GetPlaceByIdAndcheckPlaceException(placeId);

      const imageUrls: string[] = [];
      for (let file of files) {
        const s3_url = await this.s3Service.uploadToS3(file, placeId);
        imageUrls.push(s3_url);
      }

      await this.reviewRepository.save(
        this.reviewRepository.create({
          place_id: placeId,
          user_id: authUser.id,
          imageUrls,
          description,
        }),
      );
      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
