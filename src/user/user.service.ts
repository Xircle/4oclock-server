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

@Injectable()
export class UserService {
  codeMap: Map<any, any>;
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly users: UserRepository,
    private readonly s3Service: S3Service,
    private readonly placeRepository: PlaceRepository,
  ) {
    this.codeMap = new Map();
    this.codeMap.set('잇힝조아', { role: UserRole.Client, team: 'Z1' });
    this.codeMap.set('주량2리더', { role: UserRole.Owner, team: 'Z2' });
    this.codeMap.set('신사동연고이팅', { role: UserRole.Admin, team: 'Z3' });
  }

  async findUserById(id: string): Promise<User> {
    return this.users.findOne({
      where: {
        id,
      },
    });
  }

  async me(authUser: User): Promise<MeOutput> {
    try {
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
          createdAt: MoreThan('2022-03-30'),
        },
      });
      return {
        ok: true,
        data: {
          accountType: authUser.role,
          reservation_count: reservations.length,
          ...authUser.profile,
          this_season_reservation_count: thisSeasonReservations.length,
        },
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async seeRandomProfile(
    authUser: User,
    ykClubOnly: boolean,
  ): Promise<SeeRandomProfileOutput> {
    try {
      const randomUser = await this.users.findRandomUser(
        authUser.id,
        ykClubOnly,
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
      const user = await this.users.findOne({
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
      await this.users.delete({
        id: authUser.id,
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
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
        ...editProfileInput,
      };

      if (_.isEqual(updateData, {})) {
        // 바뀐 내용이 없으면 업데이트 없이 리턴
        return {
          ok: true,
        };
      }
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
        if (this.codeMap.has(code)) {
          await transactionalEntityManager.update(
            User,
            {
              id: authUser.id,
            },
            {
              role: this.codeMap.get(code).role,
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

  async verifyUserByCode(code: string) {}
}
