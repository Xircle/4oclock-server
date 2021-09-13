import { Place } from './../entities/place.entity';
import { CoreOutput } from 'src/common/common.interface';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetPlacesByAroundOutput extends CoreOutput {
  places?: Place[];
}
