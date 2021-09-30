import { MainFeedPlaceParticipantsProfile } from './get-place-by-location.dto';
import { CoreOutput } from 'src/common/common.interface';

export class PlaceDataParticipantsProfile extends MainFeedPlaceParticipantsProfile {}

export class PlaceData {
  name: string;
  oneLineIntroText: string;
  recommendation: string;
  startDateFromNow: string;
  coverImage: string;
  isClosed: boolean;
  views: number;
  isParticipating: boolean;
  participantsCount: number;
  participants: PlaceDataParticipantsProfile[];
  participantsInfo: {
    total_count: number;
    male_count: number;
    average_age: number;
  };
  placeDetail: {
    title: string;
    description: string;
    categories: string[];
    detailAddress: string;
    photos: string[];
    participationFee: number;
  };
}

export class GetPlaceByIdOutput extends CoreOutput {
  placeData?: PlaceData;
}
