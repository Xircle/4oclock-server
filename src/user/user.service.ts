import { SeeUserByIdOutput } from './dtos/see-user-by-id.dto';
import { UserRepository } from './repositories/user.repository';
import { PlaceUtilService } from './../utils/place/place-util.service';
import { GetMyPlaceOutput, MyXircle } from './dtos/getPlaceHistory.dto';
import { Reservation } from './../reservation/entities/reservation.entity';
import { MeOutput } from './dtos/me.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SeeRandomProfileOutput } from './dtos/see-random-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private placeUtilRepository: PlaceUtilService,
    private users: UserRepository,
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
}
