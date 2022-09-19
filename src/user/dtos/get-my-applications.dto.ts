import { ApplicationStatus } from './../../application/entities/application.entity';
import { CoreOutput } from './../../common/common.interface';

export class MyApplication {
  id: string;
  status: ApplicationStatus;
  appliedAt: Date;
  teamId: number;
  teamName: string;
  isCanceled: boolean;
}

export class GetMyApplicationsOutput extends CoreOutput {
  application?: MyApplication[];
}
