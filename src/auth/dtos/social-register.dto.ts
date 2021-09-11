import { User } from './../../user/entities/user.entity';
import { SocialProfile } from './../../common/common.interface';
import { CoreOutput } from 'src/common/common.interface';
import { Gender } from 'src/user/entities/user-profile.entity';

export class SocialRegisterInput {
  uid: string;
  email: string;
  // profile
  phoneNumber: string;
  username: string;
  university: string;
  isGraduate: boolean;
  age: number;
  isProfilePrivate: boolean;
  gender: Gender;
  job: string;
  shortBio: string;
  location: string | null;
  interests?: string[] | null;
  isMarketingAgree: boolean;
}
export class SocialRegisterOutput extends CoreOutput {}

export class SocialRedirectInput extends SocialProfile {}
export class SocialRedirectOutput extends CoreOutput {
  code?: number;
  user?: User;
}
