import { MainFeedPlaceParticipantsProfile } from '@place/dtos/get-place-by-location.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Reservation } from './../entities/reservation.entity';

@EntityRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {
  public async isParticipating(
    userId: string,
    placeId: string,
  ): Promise<boolean> {
    const exists = await this.findOne({
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
    const participants = await this.find({
      where: {
        place_id: placeId,
        isCanceled: false,
      },
      loadEagerRelations: true,
      relations: ['participant'],
    });
    if (participants.length === 0) return [];
    const mainFeedPlacePartiProfile: MainFeedPlaceParticipantsProfile[] = [];
    participants.map((parti) => {
      mainFeedPlacePartiProfile.push({
        userId: parti.participant.id,
        profileImgUrl: parti.participant.profile?.profileImageUrl,
        gender: parti.participant.profile?.gender,
        age: parti.participant.profile?.age,
        job: parti.participant.profile?.job,
        shortBio: parti.participant.profile?.shortBio,
        isYkClub: parti.participant.profile?.isYkClub,
      });
    });
    return mainFeedPlacePartiProfile;
  }
}
