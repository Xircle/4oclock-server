import { Place } from './../../place/entities/place.entity';
import { CoreOutput } from '@common/common.interface';

export class MyXircle {
  id: string;
  kakaoPlaceId?: string;
  coverImage: string;
  name: string;
  oneLineIntroText: string;
  description: string;
  startDateFromNow: string;
  isClosed: boolean;
  participantsCount: number;
}

export class GetMyPlaceOutput extends CoreOutput {
  places: MyXircle[];
}

export class GetMyPlaceCreatedOutput extends CoreOutput {
  places?: Place[];
}
