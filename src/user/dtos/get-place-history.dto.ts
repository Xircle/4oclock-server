import { CoreOutput } from 'src/common/common.interface';

export class MyXircle {
  id: string;
  coverImage: string;
  name: string;
  oneLineIntroText: string;
  startDateFromNow: string;
  isClosed: boolean;
  participantsCount: number;
}

export class GetMyPlaceOutput extends CoreOutput {
  places: MyXircle[];
}
