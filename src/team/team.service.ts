import { GetTeamsByCategoryInput } from './dtos/get-teams-by-category.dto';
import { UserRepository } from './../user/repositories/user.repository';
import {
  GetTeamByIdInput,
  GetTeamByIdOutput,
  GetTeamByIdLeaderData,
} from './dtos/get-team-by-id.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TeamRepository } from './repository/team.repository';
import { GetTeamsOutput } from './dtos/get-teams.dto';
import { CannotAttachTreeChildrenEntityError } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    private teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
  ) {}

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

      const leader = await this.userRepository.findOne(
        { id: team.leader_id },
        {
          loadEagerRelations: true,
        },
      );

      console.log(leader);
      const leaderData: GetTeamByIdLeaderData = {
        id: leader.id,
        username: leader.profile.username,
        profileImageUrl: leader.profile.profileImageUrl,
        shortBio: leader.profile.shortBio,
      };
      if (team.leader_id === getTeamByIdInput.userId) {
      } else {
      }

      return {
        ok: true,
        data: {
          id: team.id,
          name: team.name,
          season: team.season,
          startDate: team.startDate,
          description: team.description,
          images: team.images,
          applications: team.applications,
          leader: leaderData,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  public async getTeamsByCategory(
    getTeamsByCategoryInput: GetTeamsByCategoryInput,
  ): Promise<GetTeamsOutput> {
    try {
      const teams = await this.teamRepository.find({
        where: {
          category_id: getTeamsByCategoryInput.categoryId,
        },
        order: {
          startDate: 'ASC',
        },
      });
      return { ok: true, teams: teams };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
