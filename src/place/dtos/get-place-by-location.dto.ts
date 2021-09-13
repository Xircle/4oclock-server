import { Place } from '../entities/place.entity';
import { CoreOutput } from 'src/common/common.interface';

export class GetPlacesByLocationOutput extends CoreOutput {
  places?: Place[];
}
