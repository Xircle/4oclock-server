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
  leaderIntro?: string;
  area_ids?: string[];
  area_names?: string[];
  activity_titles?: string[];
  activity_details?: string[];
  mission?: string;
  oneLineInfo?: string;
  category_name?: string;
}

export class GetTeamsOutput extends CoreOutput {
  teams?: TeamData[];
  meta?: TeamMetaData;
}

export class GetTeamsNotPagination extends CoreOutput {
  teams?: TeamData[];
}
