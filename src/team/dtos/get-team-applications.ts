import { Gender } from './../../user/entities/user-profile.entity';
import { CoreOutput } from './../../common/common.interface';

export class ApplicantProfiles {
  username: string;
  gender: Gender;
  age: number;
}

export class GetTeamApplicationsOutput extends CoreOutput {
  maxParticipant: number;
  curCount: number;
  maleApproveCount: number;
  femaleApproveCount: number;
  maleApplyCount: number;
  femaleApplyCount: number;
  pendingApplicantProfiles: ApplicantProfiles[];
  approvedApplicantProfiles: ApplicantProfiles[];
}
