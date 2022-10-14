import { Gender } from './../../user/entities/user-profile.entity';
import { CoreOutput } from './../../common/common.interface';

export class ApplicantProfiles {
  username: string;
  gender: Gender;
  age: number;
  applicationId?: string;
}

export class CountData {
  maxParticipant: number;
  curCount: number;
  maleApproveCount: number;
  femaleApproveCount: number;
  maleApplyCount: number;
  femaleApplyCount: number;
}

export class GetTeamApplications extends CountData {
  pendingApplicantProfiles: ApplicantProfiles[];
  approvedApplicantProfiles: ApplicantProfiles[];
}

export class GetTeamApplicationsOutput extends CoreOutput {
  data?: GetTeamApplications;
}
