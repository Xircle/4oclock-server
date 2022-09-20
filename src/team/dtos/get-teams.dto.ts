import { CoreOutput } from '@common/common.interface';

export class TeamData {
  id: number;
  name: string;
  season?: number;
  leader_id?: string;
  startDtate?: Date;
  endDate?: Date;
  description?: string;
  images?: string[];
}

export class GetTeamsOutput extends CoreOutput {
  teams: TeamData[];
}
