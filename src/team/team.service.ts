import { Gender } from '@user/entities/user-profile.entity';
import { ApplicationStatus } from 'application/entities/application.entity';
import { Team } from 'team/entities/team.entity';
import { ApplicationRepository } from './../application/repositories/application.repository';
import {
  ApplicantProfiles,
  CountData as teamCountData,
  GetTeamApplications,
  GetTeamApplicationsOutput,
} from './dtos/get-team-applications';
import { UserProfileRepository } from './../user/repositories/user-profile.repository';
import { UserProfile } from './../user/entities/user-profile.entity';
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
import { Not } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    private teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
    private s3Service: S3Service,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly applicationRepository: ApplicationRepository,
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
          areaInfo: team.area_info,
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
      let leaderId = authUser.id;
      if (createTeamInput.leaderId) {
        const leader = await this.userRepository.findOne({ id: leaderId });
        leaderId = leader.id;
      } else if (createTeamInput.leaderPhoneNumber) {
        const leader = await this.userProfileRepository.findOne({
          phoneNumber: createTeamInput.leaderPhoneNumber,
        });
        leaderId = leader.fk_user_id;
      }
      const { images } = files;
      const imageS3Urls: string[] = [];
      if (images) {
        for (const image of images) {
          const s3_url = await this.s3Service.uploadToS3(image, authUser.id);
          imageS3Urls.push(s3_url);
        }
      }

      await this.teamRepository.createTeam(
        leaderId,
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

  public async getTeamApplicationsForLeader(
    authUser: User,
    teamId: number,
  ): Promise<GetTeamApplicationsOutput> {
    try {
      const pendingApplicantProfiles: ApplicantProfiles[] = [];
      const approvedApplicantProfiles: ApplicantProfiles[] = [];
      let maleApproveCount = 0;
      let femaleApproveCount = 0;
      let maleApplyCount = 0;
      let femaleApplyCount = 0;

      const team: Team = await this.teamRepository.findByTeamId(teamId);

      const applications = await this.applicationRepository.find({
        where: {
          team_id: teamId,
          isCanceled: false,
        },
        join: {
          alias: 'team',
          leftJoinAndSelect: {
            applicant: 'team.applicant',
            profile: 'applicant.profile',
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });
      // console.log(applications[0].applicant.profile);
      // 캔슬된거 아님 지원으로 친다
      for (const application of applications) {
        if (application.applicant.profile.gender === Gender.Male) {
          maleApplyCount++;
        } else if (application.applicant.profile.gender === Gender.Female) {
          femaleApplyCount++;
        }

        if (application.status === ApplicationStatus.Pending) {
          pendingApplicantProfiles.push({
            username: application.applicant.profile.username,
            gender: application.applicant.profile.gender,
            age: application.applicant.profile.age,
            applicationId: application.id,
            profileImg: application.applicant.profile.profileImageUrl,
          });
        }
      }
      const approveds = await this.userRepository.findUsersByTeamId(teamId);

      for (const approved of approveds) {
        if (approved.profile.gender === Gender.Male) {
          maleApproveCount++;
        } else if (approved.profile.gender === Gender.Female) {
          femaleApproveCount++;
        }

        approvedApplicantProfiles.push({
          username: approved.profile.username,
          gender: approved.profile.gender,
          age: approved.profile.age,
          phoneNumber: approved.profile.phoneNumber,
          profileImg: approved.profile.profileImageUrl,
          userId: approved.id,
        });
      }

      let countData: teamCountData = {
        maxParticipant: team.maxParticipant,
        curCount: femaleApproveCount + maleApproveCount,
        maleApproveCount: maleApproveCount,
        femaleApproveCount: femaleApproveCount,
        maleApplyCount: maleApplyCount,
        femaleApplyCount: femaleApplyCount,
      };

      return {
        ok: true,
        data: {
          ...countData,
          pendingApplicantProfiles: pendingApplicantProfiles,
          approvedApplicantProfiles: approvedApplicantProfiles,
        },
      };
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
      console.log(teams.length);
      console.log(teamMetadata);

      return { ok: true, teams: teams, meta: teamMetadata };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
