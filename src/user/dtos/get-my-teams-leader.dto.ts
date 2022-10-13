import { CoreOutput } from '@common/common.interface';

export class MyTeamsLeader {
  teamId: number;
  teamImage?: string;
  name: string;
  total: number;
  count: number;
}

export class GetMyTeamsLeaderOutput extends CoreOutput {
  teams?: MyTeamsLeader[];
}
