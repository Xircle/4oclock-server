import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TeamRepository } from './repository/team.repository';
import { GetTeamsOutput } from './dtos/get-teams.dto';

@Injectable()
export class TeamService {
  constructor(private teamRepository: TeamRepository) {}

  public async getTeams(): Promise<GetTeamsOutput> {
    try {
      const teams = await this.teamRepository.findManyTeams();
      return {
        ok: true,
        teams: teams,
      };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
