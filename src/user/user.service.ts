import { S3Service } from './../aws/s3/s3.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { SeeUserByIdOutput } from './dtos/see-user-by-id.dto';
import { UserRepository } from './repositories/user.repository';
import { PlaceUtilService } from './../utils/place/place-util.service';
import { GetMyPlaceOutput, MyXircle } from './dtos/get-place-history.dto';
import { Reservation } from './../reservation/entities/reservation.entity';
import { MeOutput } from './dtos/me.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SeeRandomProfileOutput } from './dtos/see-random-profile.dto';
import { CoreOutput } from 'src/common/common.interface';
import { UserProfile } from './entities/user-profile.entity';
import * as _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private placeUtilRepository: PlaceUtilService,
    private users: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

  async me(authUser: User): Promise<MeOutput> {
    try {
      const reservations = await this.reservationRepository.find({
        where: {
          user_id: authUser.id,
        },
      });
      const { profileImageUrl, age, university, username } = authUser.profile;
      return {
        ok: true,
        data: {
          profileImageUrl,
          username,
          university,
          age,
          reservation_count: reservations.length,
        },
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async seeRandomProfile(authUser: User): Promise<SeeRandomProfileOutput> {
    try {
      const randomUser = await this.users.findRandomUser(authUser.id);

      const {
        profileImageUrl,
        location,
        username,
        job,
        university,
        age,
        shortBio,
      } = randomUser.profile;
      return {
        ok: true,
        randomProfile: {
          id: randomUser.id,
          profileImageUrl,
          location,
          username,
          job,
          university,
          age,
          shortBio,
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

      const {
        profileImageUrl,
        location,
        username,
        job,
        university,
        age,
        shortBio,
      } = user.profile;

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
          profileImageUrl,
          location,
          username,
          job,
          university,
          age,
          shortBio,
        },
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getMyPlace(authUser: User): Promise<GetMyPlaceOutput> {
    try {
      const reservations = await this.reservationRepository.find({
        where: {
          user_id: authUser.id,
        },
        relations: ['place'],
      });

      const historyPlaces: MyXircle[] = [];
      reservations.map((res) => {
        const startDateFromNow = this.placeUtilRepository.getEventDateCaption(
          res.place.startDateAt,
        );
        historyPlaces.push({
          id: res.place.id,
          coverImage: res.place.coverImage,
          name: res.place.name,
          tags: res.place.tags,
          recommendation: res.place.recommendation,
          isClosed: res.place.isClosed,
          startDateFromNow,
        });
      });
      return {
        ok: true,
        places: historyPlaces,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async editProfile(
    authUser: User,
    profileImageFile: Express.Multer.File,
    editProfileInput: EditProfileInput,
  ): Promise<CoreOutput> {
    try {
      const user = await this.users.findOne({
        where: {
          id: authUser.id,
        },
      });
      if (!user) {
        return {
          ok: false,
          error: '존재하지 않는 계정입니다.',
        };
      }

      let updateData: Partial<UserProfile> = {};
      let profile_image_s3;
      // Upload to s3 when profile file exists
      if (profileImageFile) {
        profile_image_s3 = await this.s3Service.uploadToS3(
          profileImageFile,
          user.id,
        );
        updateData.profileImageUrl = profile_image_s3;
      }
      updateData = {
        ...updateData,
        ...editProfileInput,
      };
      if (_.isEqual(updateData, {})) {
        return {
          ok: true,
        };
      }
      await getManager().transaction(async (transactionalEntityManager) => {
        // Update profile
        await transactionalEntityManager.update(
          UserProfile,
          {
            fk_user_id: user.id,
          },
          {
            ...updateData,
          },
        );
      });
      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
