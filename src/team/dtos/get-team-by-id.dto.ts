import { ApplicationData } from './../../application/dtos/edit-application.dto';
import { TeamData } from './get-teams.dto';
import { CoreOutput } from './../../common/common.interface';
export class GetTeamByIdInput {
  teamId?: number;
  userId?: string;
}

export class MinMaxAge {
  maleMinAge?: number;
  maleMaxAge?: number;
  femaleMinAge?: number;
  femaleMaxAge?: number;
}

export class GetTeamByIdQueryParameter {
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
  shortBio: string;
}

export class DetailTeamData extends TeamData {
  maleCount?: number;
  femaleCount?: number;
}
export class GetTeamByIdData extends DetailTeamData {
  applications?: ApplicationData[];
}

export class GetTeamByIdOutput extends CoreOutput {
  data?: GetTeamByIdData;
}
