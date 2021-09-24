import { MainFeedPlaceParticipantsProfile } from './../../place/dtos/get-place-by-location.dto';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import 'moment/locale/ko';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationUtilService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async isParticipating(userId: string, placeId: string): Promise<boolean> {
    const exists = await this.reservationRepository.findOne({
      where: {
        user_id: userId,
        place_id: placeId,
      },
    });
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
}
