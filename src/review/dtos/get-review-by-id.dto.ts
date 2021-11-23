import { CoreOutput } from '@common/common.interface';
import { Review } from '../entities/review.entity';

export class GetReviewById extends CoreOutput {
  review?: Review;
}
