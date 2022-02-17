import { CoreOutput } from '@common/common.interface';
import { Review } from '@review/entities/review.entity';
import { MainFeedPlaceParticipantsProfile } from './get-places.dto';

export class PlaceDataParticipantsProfile extends MainFeedPlaceParticipantsProfile {}

export class PlaceData {
  name: string;
  recommendation?: string;
  startDateAt: Date;
  startDateFromNow: string;
  coverImage: string;
  isClosed: boolean;
  views: number;
  isParticipating: boolean;
  participants: PlaceDataParticipantsProfile[];
  participantsData: {
    participantsCount: number;
    leftParticipantsCount: number;
    maleCount?: number;
    femaleCount?: number;
  };
  placeDetail: {
    title?: string;
    description: string;
    detailAddress: string;
    participationFee: number;
    maxParticipantsNumber: number;
  };
}

export class GetPlaceByIdOutput extends CoreOutput {
  placeData?: PlaceData;
}
