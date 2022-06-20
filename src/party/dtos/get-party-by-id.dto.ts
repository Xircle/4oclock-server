import { CoreOutput } from './../../common/common.interface';
import { Party } from './../entities/party.entity';
export class GetPlaceByIdOutput extends CoreOutput {
  parties?: Party[];
}
