import { Gender } from 'src/user/entities/user-profile.entity';
import { CoreOutput } from 'src/common/common.interface';
export class MeData {
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
