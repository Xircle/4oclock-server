import { Gender } from 'src/user/entities/user-profile.entity';
import { CoreOutput } from 'src/common/common.interface';

export class MainFeedPlaceParticipantsProfile {
  userId: string;
  profileImgUrl: string;
  gender: Gender;
  age: number;
}
export class MainFeedPlace {
  id: string;
  name: string;
  coverImage: string;
  deadline?: string | undefined;
  startDateFromNow: string;
  oneLineIntroText: string;
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
}

export class GetPlaceByLocationWhereOptions {
  location?: string;
}
