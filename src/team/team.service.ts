import { GetTeamsWithFilterInput } from './dtos/get-teams-with-filter.dto';
import { GetTeamsByCategoryInput } from './dtos/get-teams-by-category.dto';
import { UserRepository } from './../user/repositories/user.repository';
import {
  GetTeamByIdInput,
  GetTeamByIdOutput,
  GetTeamByIdLeaderData,
  GetTeamByIdQueryParameter,
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
    getTeamByIdQueryParameter: GetTeamByIdQueryParameter = {},
  ): Promise<GetTeamByIdOutput> {
    try {
      const team = await this.teamRepository.findOne(
        {
          id: getTeamByIdQueryParameter.teamId,
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

      const leaderData: GetTeamByIdLeaderData = {
        id: leader.id,
        username: leader.profile.username,
        profileImageUrl: leader.profile.profileImageUrl,
        shortBio: leader.profile.shortBio,
      };
      if (team.leader_id === getTeamByIdQueryParameter?.userId) {
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

  public async getTeamsByCategory(categoryId: string): Promise<GetTeamsOutput> {
    try {
      const teams = await this.teamRepository.find({
        where: {
          category_id: categoryId,
          isClosed: false,
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

  public async getTeamsWithFilter(
    getTeamsWithFilterInput: GetTeamsWithFilterInput,
  ): Promise<GetTeamsOutput> {
    try {
      const teams = await this.teamRepository.findTeamsWithFilter(
        getTeamsWithFilterInput,
      );
      return { ok: true, teams: teams };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
