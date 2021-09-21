import { CoreOutput } from 'src/common/common.interface';
import { UserProfile } from './see-random-profile.dto';

export class SeeUserByIdOutput extends CoreOutput {
  user?: UserProfile;
}
