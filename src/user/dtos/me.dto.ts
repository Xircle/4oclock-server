import { CoreOutput } from 'src/common/common.interface';
export class MeData {
  profileImageUrl?: string;
  username: string;
  university: string;
  age: number;
  reservation_count: number;
}

export class MeOutput extends CoreOutput {
  data: MeData;
}
