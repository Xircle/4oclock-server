import { CoreOutput } from '@common/common.interface';
import { Gender } from '@user/entities/user-profile.entity';
import { UserRole } from '../entities/user.entity';
export class MeData {
  accountType: UserRole;
  sofoCode: string;
  gender: Gender;
  shortBio: string;
  activities: string;
  job: string;
  profileImageUrl?: string;
  username: string;
  university: string;
  age: number;
  location: string;
  interests: string[];
  reservation_count: number;
  isYkClub: boolean;
  personality: string;
  MBTI: string;
  drinkingStyle: number;
}

export class MeOutput extends CoreOutput {
  data: MeData;
}
