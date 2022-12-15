import { CoreOutput } from '@common/common.interface';

class Area {
  id: string;
  name: string;
}

export class GetAreaOutput extends CoreOutput {
  areas?: Area[];
}
