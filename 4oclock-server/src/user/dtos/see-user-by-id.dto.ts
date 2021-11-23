import { CoreOutput } from '@common/common.interface';
import { RandomUserProfile } from './see-random-profile.dto';

export class SeeUserByIdOutput extends CoreOutput {
  user?: RandomUserProfile;
}
