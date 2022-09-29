import { TeamMetaData } from './../interfaces/teams-with-meta';
import { CoreOutput } from '@common/common.interface';

export class TeamData {
  id: number;
  name: string;
  season?: number;
  leader_id?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  images?: string[];
  category?: string;
}

export class GetTeamsOutput extends CoreOutput {
  teams?: TeamData[];
  meta?: TeamMetaData;
}
