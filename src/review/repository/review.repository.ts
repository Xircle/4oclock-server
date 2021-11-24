import {
  DeepPartial,
  EntityManager,
  EntityRepository,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Review } from '../entities/review.entity';

@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {
  public async findReviewById(
    id: string,
    options?: FindOneOptions<Review>,
  ): Promise<Review> {
    return await this.findOne({
      where: {
        id,
      },
      ...options,
    });
  }

  /**
   *
   * @param entityLike
   * @param entityManager
   * @description entity를 create하고 save한다. Transaction 상황에는 entityManager가 save한다.
   */
  public async createAndSaveReview(
    entityLike: DeepPartial<Review>,
    entityManager?: EntityManager,
  ): Promise<Review> {
    const review = this.create(entityLike);
    if (entityManager) {
      await entityManager.save(review);
    } else {
      await this.save(review);
    }
    return review;
  }

  public async updateReview(
    reviewId: string,
    partialEntity: QueryDeepPartialEntity<Review>,
  ) {
    return await this.update({ id: reviewId }, partialEntity);
  }
}
