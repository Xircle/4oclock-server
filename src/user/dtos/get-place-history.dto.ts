import { CoreOutput } from 'src/common/common.interface';

export class MyXircle {
  id: string;
  coverImage: string;
  name: string;
  recommendation: string;
  startDateFromNow: string;
  isClosed: boolean;
}

export class GetMyPlaceOutput extends CoreOutput {
  places: MyXircle[];
}
