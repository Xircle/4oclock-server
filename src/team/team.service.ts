import { GetTeamByIdInput, GetTeamByIdOutput } from './dtos/get-team-by-id.dto';
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

  public async getTeamById(
    getTeamByIdInput: GetTeamByIdInput,
  ): Promise<GetTeamByIdOutput> {
    try {
      const team = await this.teamRepository.findOne(
        {
          id: getTeamByIdInput.teamId,
        },
        {
          loadEagerRelations: true,
          relations: ['applications', 'users'],
        },
      );

      if (team.leader_id === getTeamByIdInput.userId) {
      } else {
      }

      return {
        ok: true,
        data: team,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
