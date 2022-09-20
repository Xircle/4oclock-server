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

export class GetTeamByIdLeaderData {
  id: string;
  username: string;
  profileImageUrl: string;
}

export class GetTeamByIdData extends TeamData {
  applications?: ApplicationData[];
  leader?: GetTeamByIdLeaderData;
}

export class GetTeamByIdOutput extends CoreOutput {
  data?: GetTeamByIdData;
}
