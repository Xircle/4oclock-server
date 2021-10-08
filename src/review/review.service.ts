import { Place } from 'src/place/entities/place.entity';
import { CoreOutput } from 'src/common/common.interface';
import { User } from 'src/user/entities/user.entity';
import { CreateReviewInput } from './dtos/create-review.dto';
import { Review } from 'src/review/entities/review.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  async createReview(
    authUser: User,
    createReviewInput: CreateReviewInput,
  ): Promise<CoreOutput> {
    try {
      const exists = await this.placeRepository.findOne({
        where: {
          id: createReviewInput.placeId,
        },
      });
      if (!exists) {
        return {
          ok: false,
          error: '존재하지 않는 장소입니다.',
        };
      }

      await this.reviewRepository.save(
        this.reviewRepository.create({
          imageUrl: createReviewInput.imageUrl,
          description: createReviewInput.description,
          place_id: createReviewInput.placeId,
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
