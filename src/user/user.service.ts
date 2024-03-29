import { UserProfileRepository } from './repositories/user-profile.repository';
import { RegisteredPhoneNumberRepository } from './repositories/registered-phone-number.repository';
import {
  GetMyApplicationsOutput,
  GMALeaderData,
} from './dtos/get-my-applications.dto';
import { ApplicationRepository } from './../application/repositories/application.repository';
import { TeamRepository } from './../team/repository/team.repository';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PlaceRepository } from './../place/repository/place.repository';
import * as _ from 'lodash';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getManager, MoreThan } from 'typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { EditProfileInput, EditPlaceQueryParam } from './dtos/edit-profile.dto';
import { SeeUserByIdOutput } from './dtos/see-user-by-id.dto';
import { UserRepository } from './repositories/user.repository';
import {
  GetMyPlaceCreatedOutput,
  GetMyPlaceOutput,
  MyXircle,
} from './dtos/get-place-history.dto';
import { SeeRandomProfileOutput } from './dtos/see-random-profile.dto';
import { User, UserRole } from './entities/user.entity';
import { MeOutput } from './dtos/me.dto';
import { S3Service } from '@aws/s3/s3.service';
import { CoreOutput } from '@common/common.interface';
import { ReservationRepository } from '@reservation/repository/reservation.repository';
import { GetPointOutput } from './dtos/get-point.dto';
import {
  GetMyTeamsLeaderOutput,
  MyTeamsLeader,
} from './dtos/get-my-teams-leader.dto';

@Injectable()
export class UserService {
  codeMap: Map<any, any>;
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
    private readonly placeRepository: PlaceRepository,
    private readonly teamRepository: TeamRepository,
    private readonly applicationRepository: ApplicationRepository,
    private schedulerRegistry: SchedulerRegistry,
    private registeredPhoneNumberRepository: RegisteredPhoneNumberRepository,
    private readonly userProfileRepository: UserProfileRepository,
  ) {
    this.codeMap = new Map();
    this.codeMap.set('친구', { role: UserRole.Client });
    this.codeMap.set('케빈', { role: UserRole.Owner });
    this.codeMap.set('운영쥔', { role: UserRole.Admin });
  }

  async findUserById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async me(authUser: User): Promise<MeOutput> {
    try {
      if (authUser.profile.phoneNumber) {
        const verifyResult =
          await this.registeredPhoneNumberRepository.verifyByPhoneNumber(
            authUser.profile.phoneNumber,
          );

        if (verifyResult.ok) {
          if (verifyResult.role) {
            await this.userRepository.update(
              { id: authUser.id },
              { role: verifyResult.role },
            );
          }
          await this.userProfileRepository.update(
            { fk_user_id: authUser.id },
            { isYkClub: true },
          );
        }
      }
      const reservations = await this.reservationRepository.find({
        where: {
          user_id: authUser.id,
          isCanceled: false,
        },
      });
      const thisSeasonReservations = await this.reservationRepository.find({
        where: {
          user_id: authUser.id,
          isCanceled: false,
          createdAt: MoreThan('2022-11-01'),
        },
      });
      let team;
      if (authUser.team_id) {
        team = await this.teamRepository.findOne(authUser.team_id);
      }
      return {
        ok: true,
        data: {
          accountType: authUser.role,
          reservation_count: reservations.length,
          ...authUser.profile,
          team_id: authUser.team_id,
          this_season_reservation_count: thisSeasonReservations.length,
          team: authUser.team_id && team ? team?.name : '',
        },
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async seeRandomProfile(
    authUser: User,
    myTeamOnly: boolean,
  ): Promise<SeeRandomProfileOutput> {
    try {
      const randomUser = await this.userRepository.findRandomUser(
        authUser.id,
        myTeamOnly,
        authUser.team,
      );
      if (!randomUser) return { ok: true };

      return {
        ok: true,
        randomProfile: {
          id: randomUser.id,
          ...randomUser.profile,
        },
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async seeUserById(userId: string): Promise<SeeUserByIdOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return {
          ok: false,
          error: '존재하지 않는 유저입니다.',
        };
      }

      return {
        ok: true,
        user: {
          id: user.id,
          ...user.profile,
        },
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async getMyPlaceCreated(authUser: User): Promise<GetMyPlaceCreatedOutput> {
    try {
      const placesCreated = await this.placeRepository.find({
        where: {
          creator_id: authUser.id,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        ok: true,
        places: placesCreated,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async getMyApplications(authUser: User): Promise<GetMyApplicationsOutput> {
    try {
      const applications =
        await this.applicationRepository.findApplicationsByStatus(authUser.id);
      let leaderData: GMALeaderData | undefined;
      if (applications?.approveds?.length > 0) {
        const team = await this.teamRepository.findOne({
          id: applications?.approveds?.[0].teamId,
        });
        if (team?.leader_id) {
          const leader = await this.userRepository.findOne({
            where: {
              id: team.leader_id,
            },
            relations: ['profile'],
          });
          leaderData = {
            leaderId: leader.id,
            leaderName: leader.profile.username,
            leaderPhoneNumber: leader.profile.phoneNumber,
            leaderProfileUrl: leader.profile.profileImageUrl,
          };
        }
      }
      return { ok: true, applications, leaderData };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async getMyPlace(authUser: User): Promise<GetMyPlaceOutput> {
    try {
      const reservations = await this.reservationRepository.find({
        where: {
          user_id: authUser.id,
          isCanceled: false,
        },
        order: {
          createdAt: 'DESC',
        },
        relations: ['place'],
      });

      const historyPlaces: MyXircle[] = [];
      for (let reservation of reservations) {
        const startDateFromNow = reservation.place.getStartDateFromNow();
        const participantsCount: number =
          await this.reservationRepository.count({
            where: {
              place_id: reservation.place_id,
              isCanceled: false,
            },
          });
        historyPlaces.push({
          id: reservation.place.id,
          coverImage: reservation.place.coverImage,
          kakaoPlaceId: reservation.place.kakaoPlaceId,
          name: reservation.place.name,
          oneLineIntroText: reservation.place.oneLineIntroText,
          description: reservation.place.placeDetail.description,
          participantsCount,
          isClosed: reservation.place.isClosed,
          startDateFromNow,
        });
      }

      return {
        ok: true,
        places: historyPlaces,
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(authUser: User): Promise<CoreOutput> {
    try {
      await this.userRepository.delete({
        id: authUser.id,
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async patchTeam(authUser: User, teamId: number): Promise<CoreOutput> {
    try {
      const team = await this.teamRepository.findOne(teamId);

      await getManager().transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.update(
          User,
          {
            id: authUser.id,
          },
          {
            team_id: team.id,
          },
        );
      });
      return { ok: true, error: '팀 입력 성공!' };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async getPoint(authUser: User, season: number): Promise<GetPointOutput> {
    try {
      const point = await this.userRepository.getPointThisSeason(
        authUser,
        season,
      );
      await getManager().transaction(async (transactionalEntityManager) => {});
      return {
        ok: true,
        data: {
          totalPointThisSeason: 4,
          myPointThisSeason: point,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async editProfile(
    { code }: EditPlaceQueryParam = {},
    authUser: User,
    profileImageFile: Express.Multer.File,
    editProfileInput: EditProfileInput,
  ): Promise<CoreOutput> {
    try {
      let updateData: Partial<UserProfile & User> = {};
      // Upload to s3 when profile file exists
      if (profileImageFile) {
        const profile_image_s3 = await this.s3Service.uploadToS3(
          profileImageFile,
          authUser.id,
        );
        updateData.profileImageUrl = profile_image_s3;
      }

      if (this.codeMap.has(code)) {
        editProfileInput.isYkClub = true;
      }

      updateData = {
        ...updateData,
        username: editProfileInput.username,
        shortBio: editProfileInput.shortBio,
        job: editProfileInput.job,
        activities: editProfileInput.activities,
        isYkClub: editProfileInput.isYkClub,
        MBTI: editProfileInput.MBTI,
        personality: editProfileInput.personality,
        drinkingStyle: editProfileInput.drinkingStyle,
      };

      if (_.isEqual(updateData, {})) {
        // 바뀐 내용이 없으면 업데이트 없이 리턴
        return {
          ok: true,
        };
      }
      const team = await this.teamRepository.findOne(editProfileInput.teamId);

      await getManager().transaction(async (transactionalEntityManager) => {
        // Update profile
        await transactionalEntityManager.update(
          UserProfile,
          {
            fk_user_id: authUser.id,
          },
          {
            ...updateData,
          },
        );
        if (
          (code && this.codeMap.get(code)?.role) ||
          authUser.profile.isYkClub
        ) {
          await transactionalEntityManager.update(
            User,
            {
              id: authUser.id,
            },
            {
              role:
                code && this.codeMap.get(code)?.role
                  ? this.codeMap.get(code).role
                  : authUser.role,
              //team_id: editProfileInput.teamId,
            },
          );
        }
      });
      return {
        ok: true,
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateFirebaseToken(authUser: User, token: string) {
    await getManager().transaction(async (transactionalEntityManager) => {
      // Update profile

      await transactionalEntityManager.update(
        User,
        {
          id: authUser.id,
        },
        {
          firebaseToken: [token],
        },
      );
    });
  }

  async reportUser() {
    return { ok: true };
  }

  async getMyTeamsLeader(authUser: User): Promise<GetMyTeamsLeaderOutput> {
    try {
      const teamsFromRepository = await this.teamRepository.find({
        where: {
          leader_id: authUser.id,
        },
        relations: ['users'],
      });
      let teams: MyTeamsLeader[] = [];

      for (const team of teamsFromRepository) {
        teams.push({
          teamId: team.id,
          teamImage: team.images[0],
          name: team.name,
          count: team.users?.length,
          total: team.maxParticipant,
        });
      }
      return {
        ok: true,
        teams: teams,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async verifyUserByCode(authUser: User, code: string): Promise<CoreOutput> {
    try {
      const correctCrewCode = '친구';
      const correctLeaderCode = '케빈';
      const oldRole = authUser.role;
      if (code !== correctCrewCode && code !== correctLeaderCode) {
        return {
          ok: false,
          error: 'wrong code',
        };
      }
      const role: UserRole =
        code === correctLeaderCode
          ? UserRole.Owner
          : code === correctCrewCode
          ? UserRole.Client
          : oldRole;
      await getManager().transaction(async (transactionalEntityManager) => {
        // Update profile
        await transactionalEntityManager.update(
          UserProfile,
          {
            fk_user_id: authUser.id,
          },
          {
            isYkClub: true,
          },
        );
        await transactionalEntityManager.update(
          User,
          {
            id: authUser.id,
          },
          {
            role: role,
          },
        );
      });

      // const time = moment().add(90, 'days').toDate();
      // const job = new CronJob(time, async () => {
      //   console.log('user verification expired');
      //   // Update profile

      //   await getManager().transaction(async (transactionalEntityManager) => {
      //     // Update profile
      //     await transactionalEntityManager.update(
      //       UserProfile,
      //       {
      //         fk_user_id: authUser.id,
      //       },
      //       {
      //         isYkClub: false,
      //       },
      //     );
      //     await transactionalEntityManager.update(
      //       User,
      //       {
      //         id: authUser.id,
      //       },
      //       {
      //         role: UserRole.Client,
      //       },
      //     );
      //   });
      // });
      // const jobName = `verification: ${authUser.id}`;

      // if (this.schedulerRegistry.doesExist('cron', jobName)) {
      //   console.log(`${jobName} already exist`);
      //   this.schedulerRegistry.deleteCronJob(jobName);
      // }
      // this.schedulerRegistry.addCronJob(jobName, job);
      // job.start();

      return { ok: true, error: '코드 입력 성공' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
