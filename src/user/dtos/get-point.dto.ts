import { CoreOutput } from '@common/common.interface';

export class PointData {
  totalPointThisSeason: number;
  myPointThisSeason: number;
}

export class GetPointOutput extends CoreOutput {
  data?: PointData;
}
