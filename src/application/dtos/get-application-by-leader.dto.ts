import { Gender } from '@user/entities/user-profile.entity';
import { ApplicationStatus } from 'application/entities/application.entity';
import { CoreOutput } from '@common/common.interface';
export class GetApplicationByLeaderData {
  username: string;
  mbti?: string;
  shortBio?: string;
  job?: string;
  phoneNumber?: string;
  content?: string;
  status: ApplicationStatus;
  profileImage: string;
  age: number;
  gender: Gender;
  university: string;
}

export class GetApplicationSubstitueInput {
  teamId: number;
  userId: string;
}

export class GetApplicationByLeaderInput {
  substitue?: GetApplicationSubstitueInput;
  applicationId?: string;
}

export class GetApplicationByLeaderOutput extends CoreOutput {
  data?: GetApplicationByLeaderData;
}
