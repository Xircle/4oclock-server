import { S3Service } from 'src/aws/s3/s3.service';
import { Place } from 'src/place/entities/place.entity';
import { CoreOutput } from 'src/common/common.interface';
import { User } from 'src/user/entities/user.entity';
import { CreateReviewInput } from './dtos/create-review.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllReviewsOutput } from './dtos/get-all-reviews.dto';
import { GetReviewById } from './dtos/get-review-by-id.dto';
import { ReviewRepository } from './repository/review.repository';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private readonly reviewRepository: ReviewRepository,
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
    createReviewInput: CreateReviewInput,
    files: Express.Multer.File[],
  ): Promise<CoreOutput> {
    try {
      const exists = await this.placeRepository.findOne({
        where: {
          id: placeId,
        },
      });
      if (!exists) {
        return {
          ok: false,
          error: '존재하지 않는 장소입니다.',
        };
      }
      const reviewImageUrls: string[] = [];
      for (let file of files) {
        const s3_url = await this.s3Service.uploadToS3(file, placeId);
        reviewImageUrls.push(s3_url);
      }

      await this.reviewRepository.save(
        this.reviewRepository.create({
          imageUrls: reviewImageUrls,
          description: createReviewInput.description,
          isRepresentative: createReviewInput.isRepresentative,
          place_id: placeId,
          user_id: authUser.id,
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
