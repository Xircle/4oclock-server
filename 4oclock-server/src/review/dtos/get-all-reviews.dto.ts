import { CoreOutput } from '@common/common.interface';
import { Review } from '../entities/review.entity';

export class GetAllReviewsOutput extends CoreOutput {
  reviews?: Review[];
}
