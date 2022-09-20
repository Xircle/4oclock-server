import { CoreOutput } from './../../common/common.interface';
export class GetTeamByIdInput {
  teamId: string;

  userId: string;
}

export class GetTeamByIdOutput extends CoreOutput {}
