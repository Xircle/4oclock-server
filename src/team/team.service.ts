import { S3Service } from './../aws/s3/s3.service';
import { User } from './../user/entities/user.entity';
import { CreateTeamInput, TeamPhotoInput } from './dtos/create-team.dto';
import { CoreOutput } from './../common/common.interface';
import { UserRepository } from './../user/repositories/user.repository';
import {
  GetTeamByIdOutput,
  GetTeamByIdLeaderData,
  GetTeamByIdQueryParameter,
  MinMaxAge,
} from './dtos/get-team-by-id.dto';
import { Injectable } from '@nestjs/common';
import { TeamRepository } from './repository/team.repository';
import { GetTeamsOutput, GetTeamsNotPagination } from './dtos/get-teams.dto';

@Injectable()
export class TeamService {
  constructor(
    private teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
    private s3Service: S3Service,
  ) {}

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
          price: team.price,
          meetingDay: team.meetingDay,
          meetingHour: team.meetingHour,
          maxParticipant: team.maxParticipant,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  public async getAllTimes() {
    try {
      const times = await this.teamRepository.getAllTimes();
      return { ok: true, data: times };
    } catch (error) {
      return { ok: false, error };
    }
  }

  public async getAllTeams(): Promise<GetTeamsNotPagination> {
    try {
      const teams = await this.teamRepository.find();
      return {
        ok: true,
        teams,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  public async createTeam(
    authUser: User,
    createTeamInput: CreateTeamInput,
    files: TeamPhotoInput,
  ): Promise<CoreOutput> {
    try {
      const { images } = files;

      const imageS3Urls: string[] = [];
      if (images)
        for (const image of images) {
          const s3_url = await this.s3Service.uploadToS3(image, authUser.id);
          imageS3Urls.push(s3_url);
        }

      await this.teamRepository.createTeam(
        authUser,
        createTeamInput,
        imageS3Urls,
      );
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  public async getTeamsWithFilter(
    limit: number,
    page: number,
    ages?: MinMaxAge[],
    categoryIds?: string[],
    areaIds?: string[],
    times?: number[],
  ): Promise<GetTeamsOutput> {
    try {
      await this.teamRepository.closeTeamsWithBL();
      const teams = await this.teamRepository.findTeamsWithFilter(
        limit,
        page,
        ages,
        categoryIds,
        areaIds,
        times,
      );
      const teamMetadata = await this.teamRepository.getTeamMetaData(
        page,
        limit,
        ages,
        categoryIds,
        areaIds,
      );

      return { ok: true, teams: teams, meta: teamMetadata };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
