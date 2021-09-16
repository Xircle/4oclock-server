import { User } from './../user/entities/user.entity';
import { Place } from './../place/entities/place.entity';
import {
  MakeReservationDto,
  MakeReservationOutput,
} from './dtos/make-reservation.dto';
import { MainFeedPlaceParticipantsProfile } from './../place/dtos/get-place-by-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reservation } from './entities/reservation.entity';
import { getManager, Repository } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
  ) {}

  async isParticipating(userId: string, placeId: string): Promise<boolean> {
    const exists = await this.reservationRepository.findOne({
      where: {
        user_id: userId,
        place_id: placeId,
      },
    });
    console.log('exists : ', exists);
    if (exists) return true;
    else return false;
  }

  async getParticipantsProfile(
    placeId: string,
  ): Promise<MainFeedPlaceParticipantsProfile[]> {
    const participants = await this.reservationRepository.find({
      where: {
        place_id: placeId,
      },
      relations: ['participant'],
    });
    const mainFeedPlacePartiProfile: MainFeedPlaceParticipantsProfile[] = [];
    participants.map((parti) => {
      mainFeedPlacePartiProfile.push({
        userId: parti.participant.id,
        profileImgUrl: parti.participant.profile.profileImageUrl,
        gender: parti.participant.profile.gender,
        age: parti.participant.profile.age,
      });
    });
    return mainFeedPlacePartiProfile;
  }

  async makeReservation(
    authUser: User,
    makeReservation: MakeReservationDto,
  ): Promise<MakeReservationOutput> {
    const { placeId, startTime } = makeReservation;
    try {
      const targetPlace = await this.placeRepository.findOne({
        where: {
          id: placeId,
        },
      });
      if (!targetPlace) {
        return {
          ok: false,
          error: '존재하지 않는 써클입니다.',
        };
      }
      const exists = await this.reservationRepository.findOne({
        where: {
          place_id: placeId,
          user_id: authUser.id,
          startTime,
        },
      });
      if (exists) {
        return {
          ok: false,
          error: '이미 신청하셨습니다.',
        };
      }

      await getManager().transaction(async (transactionEntityManager) => {
        const reservation = this.reservationRepository.create({
          place_id: placeId,
          user_id: authUser.id,
          startTime,
        });
        await transactionEntityManager.save(reservation);
        targetPlace.participantsCount++;
        await transactionEntityManager.save(targetPlace);
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
