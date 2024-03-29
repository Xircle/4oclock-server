import { ApplicationStatus } from './../../application/entities/application.entity';
import { CoreOutput } from './../../common/common.interface';

export class MyApplication {
  id: string;
  status: ApplicationStatus;
  appliedAt: Date;
  teamId: number;
  teamName: string;
  isCanceled: boolean;
  paid?: boolean;
  teamImage: string;
  isCancelRequested?: boolean;
}

export class MyApplicationsByStatus {
  approveds?: MyApplication[];
  pendings?: MyApplication[];
  disapproveds?: MyApplication[];
  enrolleds?: MyApplication[];
}

export class GMALeaderData {
  leaderId: string;
  leaderName: string;
  leaderPhoneNumber: string;
  leaderProfileUrl: string;
}

export class GetMyApplicationsOutput extends CoreOutput {
  applications?: MyApplicationsByStatus;
  leaderData?: GMALeaderData;
}
