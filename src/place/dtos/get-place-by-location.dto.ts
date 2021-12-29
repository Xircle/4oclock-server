import { CoreOutput } from '@common/common.interface';
import { PlaceType } from '@place/entities/place.entity';
import { PlaceMetaData } from '@place/interface/places-with-meta';
import { Gender } from '@user/entities/user-profile.entity';

export class MainFeedPlaceParticipantsProfile {
  userId: string;
  profileImgUrl: string;
  gender: Gender;
  age: number;
  job: string;
  shortBio: string;
  isYkClub: boolean;
}
export class MainFeedPlace {
  id: string;
  name: string;
  coverImage: string;
  deadline?: string | undefined;
  startDateFromNow: string;
  oneLineIntroText?: string;
  views: number;
  participants: MainFeedPlaceParticipantsProfile[];
  participantsCount: number;
  leftParticipantsCount: number;
  isClosed: boolean;
}

export class GetPlaceByLocationInput {
  location?: string;
  page: number;
}
export class GetPlacesByLocationOutput extends CoreOutput {
  places?: MainFeedPlace[];
  meta: PlaceMetaData;
  eventBannerImageUrl?: string;
}

export class GetPlaceByWhereOptions {
  location?: string;
  placeType?: PlaceType;
}
