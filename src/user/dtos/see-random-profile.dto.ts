import { CoreOutput } from '@common/common.interface';

export class RandomUserProfile {
  id: string;
  profileImageUrl: string;
  location: string;
  username: string;
  job: string;
  university: string;
  age: number;
  shortBio: string;
  gender: string;
  activities: string;
  interests?: string[];
  drinkingStyle: number;
  MBTI: string;
  personality: string;
}

export class SeeRandomProfileOutput extends CoreOutput {
  randomProfile?: RandomUserProfile;
}
