import { ApplicationData } from './../../application/dtos/edit-application.dto';
import { TeamData } from './get-teams.dto';
import { CoreOutput } from './../../common/common.interface';
export class GetTeamByIdInput {
  teamId?: number;

  userId?: string;
}

export class GetTeamByIdUserData {
  id: string;
}

export class GetTeamByIdData extends TeamData {
  applications?: ApplicationData[];
}

export class GetTeamByIdOutput extends CoreOutput {
  data?: GetTeamByIdData;
}
