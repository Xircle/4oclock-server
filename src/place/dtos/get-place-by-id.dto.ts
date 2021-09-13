import { Place } from './../entities/place.entity';
import { CoreOutput } from 'src/common/common.interface';

export class GetPlaceByIdOutput extends CoreOutput {
  place?: Place;
}
