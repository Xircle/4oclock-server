import { CoreOutput } from '@common/common.interface';
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
  oneLineIntroText: string;
  views: number;
  participants: MainFeedPlaceParticipantsProfile[];
  isParticipating: boolean;
  participantsCount: number;
  isClosed: boolean;
}

export class GetPlaceByLocationInput {
  location?: string;
  page: number;
}
export class GetPlacesByLocationOutput extends CoreOutput {
  places?: MainFeedPlace[];
  eventBannerImageUrl: string;
}

export class GetPlaceByLocationWhereOptions {
  location?: string;
}
