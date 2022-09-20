import { CoreOutput } from './../../common/common.interface';
export class GetTeamByIdInput {
  teamId?: number;

  userId?: string;
}

export class GetTeamByIdOutput extends CoreOutput {}
