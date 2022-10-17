import { Team } from 'team/entities/team.entity';
export class GetTeamsWithFilterInput {
  minAge?: number;
  maxAge?: number;
}

export class FilterTeam extends Team {
  approvedCount: number;
  applyCount: number;
}
