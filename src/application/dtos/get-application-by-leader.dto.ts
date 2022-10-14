import { CoreOutput } from '@common/common.interface';
export class GetApplicationByLeaderData {
  applicationId: string;
  username: string;
  mbti?: string;
  shortBio?: string;
  personality?: string;
  phoneNumber?: string;
  content?: string;
}

export class GetApplicationByLeaderOutput extends CoreOutput {
  data?: GetApplicationByLeaderData;
}
