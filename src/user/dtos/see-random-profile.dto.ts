import { CoreOutput } from 'src/common/common.interface';

export class UserProfile {
  id: string;
  profileImageUrl: string;
  location: string;
  username: string;
  job: string;
  university: string;
  age: number;
  shortBio: string;
}

export class SeeRandomProfileOutput extends CoreOutput {
  randomProfile?: UserProfile;
}
