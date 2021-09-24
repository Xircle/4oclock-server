import { Gender } from 'src/user/entities/user-profile.entity';
import { CoreOutput } from 'src/common/common.interface';
export class MeData {
  gender: Gender;
  shortBio: string;
  job: string;
  profileImageUrl?: string;
  username: string;
  university: string;
  age: number;
  reservation_count: number;
}

export class MeOutput extends CoreOutput {
  data: MeData;
}
