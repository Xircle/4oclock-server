import { UserRepository } from '@user/repositories/user.repository';
import { TeamRepository } from './../team/repository/team.repository';
import { EditApplicationInput } from './dtos/edit-application.dto';
import { CreateApplicationInput } from './dtos/create-application.dto';
import { User } from '@user/entities/user.entity';
import { CoreOutput } from './../common/common.interface';
import { ApplicationRepository } from './repositories/application.repository';
import { Injectable } from '@nestjs/common';
import { ApplicationStatus } from './entities/application.entity';
import { Not } from 'typeorm';
import {
  GetApplicationByLeaderInput,
  GetApplicationByLeaderOutput,
} from './dtos/get-application-by-leader.dto';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async createApplication(
    authUser: User,
    { teamId, content }: CreateApplicationInput,
  ): Promise<CoreOutput> {
    try {
      if (!authUser.profile.isYkClub) {
        return { ok: false, error: '현기수에 등록되어있지 않습니다' };
      }
      if (authUser.team_id) {
        const pastTeam = await this.teamRepository.findOne({ id: teamId });
        if (pastTeam.isClosed === false) {
          return { ok: false, error: '현재 다른 팀에 소속되어있습니다' };
        }
      }

      const exists = await this.applicationRepository.findOne({
        where: {
          team_id: teamId,
          user_id: authUser.id,
        },
      });
      if (exists && !exists.isCanceled) {
        return {
          ok: false,
          error: '이미 신청하셨습니다.',
        };
      }
      if (exists) {
        await this.applicationRepository.update(
          {
            user_id: authUser.id,
            team_id: teamId,
          },
          {
            content,
            isCanceled: false,
          },
        );
      } else {
        const team = await this.teamRepository.findOne({ id: teamId });
        if (!team) {
          return {
            ok: false,
            error: '팀이 존재하지 않습니다',
          };
        }

        if (
          team.minAge > authUser.profile.age ||
          team.maxAge < authUser.profile.age
        ) {
          return {
            ok: false,
            error: '나이대가 맞지 않습니다',
          };
        }

        const application = this.applicationRepository.create({
          team_id: teamId,
          user_id: authUser.id,
          image: authUser.profile.profileImageUrl,
          gender: authUser.profile.gender,
          content,
        });
        await this.applicationRepository.save(application);
      }

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async getApplicationByLeader(
    authUser: User,
    getApplicationByLeaderInput: GetApplicationByLeaderInput,
  ): Promise<GetApplicationByLeaderOutput> {
    try {
      const { applicationId, substitue } = getApplicationByLeaderInput;
      let application;
      if (applicationId) {
        application = await this.applicationRepository.findOne({
          where: {
            id: applicationId,
          },
          join: {
            alias: 'application',
            leftJoinAndSelect: {
              applicant: 'application.applicant',
              profile: 'applicant.profile',
            },
          },
        });
      } else if (substitue && substitue.teamId && substitue.userId) {
        application = await this.applicationRepository.findOne({
          where: {
            user_id: substitue.userId,
            team_id: substitue.teamId,
          },
          join: {
            alias: 'application',
            leftJoinAndSelect: {
              applicant: 'application.applicant',
              profile: 'applicant.profile',
            },
          },
        });
      } else {
        return {
          ok: false,
          error: 'applicationId and userId missing',
        };
      }

      if (!application) {
        return {
          ok: false,
          error: '유저를 찾을 수 없습니다',
        };
      }

      return {
        ok: true,
        data: {
          username: application.applicant.profile.username,
          mbti: application.applicant.profile.MBTI,
          shortBio: application.applicant.profile.shortBio,
          job: application.applicant.profile.job,
          phoneNumber:
            application.status === ApplicationStatus.Approved ||
            (substitue && substitue?.teamId && substitue?.userId)
              ? application.applicant.profile.phoneNumber
              : '',
          content: application.content,
          status: application.status,
          profileImage: application.applicant.profile.profileImageUrl,
          age: application.applicant.profile.age,
          gender: application.applicant.profile.gender,
          university: application.applicant.profile.university,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async editApplication(
    editApplicationInput: EditApplicationInput,
  ): Promise<CoreOutput> {
    try {
      const exists = await this.applicationRepository.findOne({
        where: {
          id: editApplicationInput.applicationId,
        },
        relations: ['team'],
      });
      if (!exists) {
        return { ok: false, error: '지원서가 존재하지 않아요' };
      }
      if (
        editApplicationInput.status === ApplicationStatus.Approved ||
        editApplicationInput.status === ApplicationStatus.Enrolled
      ) {
        const genderCount = await this.applicationRepository.findAndCount({
          where: {
            team_id: exists.team_id,
            status: ApplicationStatus.Approved,
            gender: exists.gender,
          },
        });
        console.log(genderCount[1]);
        if (genderCount[1] > exists.team.maxParticipant / 2) {
          return { ok: false, error: '특정 성비가 절반을 넘을 수 없습니다' };
        }

        const count = await this.applicationRepository.findAndCount({
          where: {
            team_id: exists.team_id,
            status: ApplicationStatus.Approved,
          },
        });
        if (count[1] >= exists.team.maxParticipant) {
          return { ok: false, error: '인원이 꽉 찼습니다' };
        }
      }

      await this.applicationRepository.update(
        {
          id: editApplicationInput.applicationId,
        },
        {
          status:
            editApplicationInput.status !== undefined &&
            editApplicationInput.status !== null
              ? editApplicationInput.status
              : exists.status,
          isCanceled:
            editApplicationInput.isCanceled === undefined ||
            editApplicationInput.isCanceled === null
              ? exists.isCanceled
              : editApplicationInput.isCanceled?.toLowerCase() === 'true',
          paid:
            editApplicationInput.paid === undefined ||
            editApplicationInput.paid === null
              ? exists.paid
              : editApplicationInput.paid?.toLowerCase() === 'true',
        },
      );
      if (editApplicationInput.status === ApplicationStatus.Approved) {
        await this.userRepository.update(
          {
            id: exists.user_id,
          },
          {
            team_id: exists.team_id,
          },
        );
        // approved 시 다 켄슬하기
        await this.applicationRepository.update(
          {
            user_id: exists.user_id,
            team_id: Not(exists.team_id),
          },
          { isCanceled: true },
        );
      }

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
