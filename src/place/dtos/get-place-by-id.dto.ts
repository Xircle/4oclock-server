import { PlaceDetail } from './../entities/place-detail.entity';
import { CoreOutput } from 'src/common/common.interface';

export class PlaceDetailData extends PlaceDetail {
  participants: {
    total_count: number;
    male_count: number;
    average_age: number;
  };
  isParticipating: boolean;
}

export class GetPlaceByIdOutput extends CoreOutput {
  placeDetailData?: PlaceDetailData;
}
