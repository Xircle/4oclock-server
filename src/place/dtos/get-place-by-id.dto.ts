import { CoreOutput } from '@common/common.interface';
import { Review } from '@review/entities/review.entity';
import { MainFeedPlaceParticipantsProfile } from './get-place-by-location.dto';

export class PlaceDataParticipantsProfile extends MainFeedPlaceParticipantsProfile {}

export class PlaceData {
  name: string;
  oneLineIntroText: string;
  recommendation: string;
  startDateAt: Date;
  startDateFromNow: string;
  coverImage: string;
  isClosed: boolean;
  views: number;
  isParticipating: boolean;
  participantsCount: number;
  participants: PlaceDataParticipantsProfile[];
  reviews: Review[];
  location: string;
  participantsInfo: {
    total_count: number;
    male_count: number;
    average_age: number;
  };
  placeDetail: {
    title: string;
    description: string;
    categories: string;
    detailAddress: string;
    participationFee: number;
    maxParticipantsNumber?: number;
  };
}

export class GetPlaceByIdOutput extends CoreOutput {
  placeData?: PlaceData;
}
