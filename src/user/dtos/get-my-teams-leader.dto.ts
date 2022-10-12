import { CoreOutput } from '@common/common.interface';

export class MyTeamsLeader {
  teamId: string;
  teamImage?: string;
  name: string;
}

export class GetMyTeamsLeader extends CoreOutput {
  teams?: MyTeamsLeader[];
}
