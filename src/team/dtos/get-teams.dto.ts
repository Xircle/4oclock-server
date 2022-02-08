import { CoreOutput } from '@common/common.interface';

export class TeamData {
  id: number;
  name: string;
}

export class GetTeamsOutput extends CoreOutput {
  teams: TeamData[];
}
