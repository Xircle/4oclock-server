import { CoreOutput } from './../../common/common.interface';

export class CategoryData {
  id: string;
  name: string;
  image?: string;
}

export class SeeAllCategoryOutput extends CoreOutput {
  data?: CategoryData[];
}
