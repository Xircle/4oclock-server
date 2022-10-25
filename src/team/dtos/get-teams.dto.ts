import { User } from '@user/entities/user.entity';
import { GetTeamByIdLeaderData } from './get-team-by-id.dto';
import { TeamMetaData } from './../interfaces/teams-with-meta';
import { CoreOutput } from '@common/common.interface';

export class TeamData {
  id: number;
  name: string;
  season?: number;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  images?: string[];
  category?: string;
  maleMinAge?: number;
  maleMaxAge?: number;
  femaleMinAge?: number;
  femaleMaxAge?: number;
  leader?: User | GetTeamByIdLeaderData;
  price?: number;
  meetingHour?: number;
  meetingDay?: number;
  maxParticipant?: number;
  areaInfo?: string;
  approveCount?: number;
  applyCount?: number;
}

export class GetTeamsOutput extends CoreOutput {
  teams?: TeamData[];
  meta?: TeamMetaData;
}

export class GetTeamsNotPagination extends CoreOutput {
  teams?: TeamData[];
}
