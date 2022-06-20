import { Party } from './../entities/party.entity';
import { CoreOutput } from './../../common/common.interface';

export class GetPartiesOutput extends CoreOutput {
  parties?: Party[];
}
