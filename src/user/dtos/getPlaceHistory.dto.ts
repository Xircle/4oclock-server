import { CoreOutput } from 'src/common/common.interface';

export class MyXircle {
  id: string;
  coverImage: string;
  name: string;
  tags: string[];
  recommendation: string;
  startDateFromNow: string;
}

export class GetMyPlaceOutput extends CoreOutput {
  places: MyXircle[];
}
