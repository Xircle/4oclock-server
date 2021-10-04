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
        isCanceled: false,
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
        isCanceled: false,
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
        job: parti.participant.profile.job,
        shortBio: parti.participant.profile.shortBio,
        isYkClub: parti.participant.profile.isYkClub,
      });
    });
    return mainFeedPlacePartiProfile;
  }
}
