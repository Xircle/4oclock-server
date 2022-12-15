import { AreaRepository } from './../area/repositories/area.repository';
import { Gender } from '@user/entities/user-profile.entity';
import { ApplicationStatus } from 'application/entities/application.entity';
import { Team } from 'team/entities/team.entity';
import { ApplicationRepository } from './../application/repositories/application.repository';
import {
  ApplicantProfiles,
  CountData as teamCountData,
  GetTeamApplicationsOutput,
} from './dtos/get-team-applications';
import { UserProfileRepository } from './../user/repositories/user-profile.repository';
import { S3Service } from './../aws/s3/s3.service';
import { User } from './../user/entities/user.entity';
import {
  CreateTeamInput,
  TeamPhotoInput,
  CreateTeamOutput,
} from './dtos/create-team.dto';
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
import { season } from 'libs/sharedData';

@Injectable()
export class TeamService {
  constructor(
    private teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
    private s3Service: S3Service,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly areaRepository: AreaRepository,
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

      const areas = await this.areaRepository.findByIds(team.area_ids);

      let areaNames: string[] = [];
      for (let area of areas) {
        areaNames.push(area.name);
      }

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
      let maleCount = 0;
      let femaleCount = 0;

      if (team?.users?.length > 0) {
        for (const user of team?.users) {
          if (user.profile.gender === Gender.Male) {
            maleCount++;
          } else {
            femaleCount++;
          }
        }
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
          maleCount,
          femaleCount,
          maleMaxAge: team.maleMaxAge,
          maleMinAge: team.maleMinAge,
          femaleMaxAge: team.femaleMaxAge,
          femaleMinAge: team.femaleMinAge,
          leaderIntro: team.leaderIntro,
          area_ids: team.area_ids,
          area_names: areaNames,

          activity_titles: team.activity_titles,
          activity_details: team.activity_details,
          mission: team.mission,
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
      const teams = await this.teamRepository.find({ season: season });
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
  ): Promise<CreateTeamOutput> {
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

      const newTeamId = await this.teamRepository.createTeam(
        leaderId,
        createTeamInput,
        imageS3Urls,
      );
      return { ok: true, teamId: newTeamId };
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
      const cancelRequestedApplicantProfiles: ApplicantProfiles[] = [];
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
        } else if (
          application.isCancelRequested === true &&
          (application.status === ApplicationStatus.Approved ||
            application.status === ApplicationStatus.Enrolled)
        ) {
          cancelRequestedApplicantProfiles.push({
            username: application.applicant.profile.username,
            gender: application.applicant.profile.gender,
            age: application.applicant.profile.age,
            applicationId: application.id,
            profileImg: application.applicant.profile.profileImageUrl,
            phoneNumber: application.applicant.profile.phoneNumber,
            userId: application.applicant.id,
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
          cancelRequestedApplicantProfiles: cancelRequestedApplicantProfiles,
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
