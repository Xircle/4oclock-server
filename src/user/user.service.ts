import { PlaceUtilService } from './../utils/place/place-util.service';
import { MainFeedPlace } from './../place/dtos/get-place-by-location.dto';
import { GetMyPlaceOutput, MyXircle } from './dtos/getPlaceHistory.dto';
import { Reservation } from './../reservation/entities/reservation.entity';
import { MeOutput } from './dtos/me.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private placeUtilRepository: PlaceUtilService,
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

// user.reservation GET /user/me 200 68.609 ms - -
