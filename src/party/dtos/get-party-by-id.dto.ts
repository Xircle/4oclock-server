import { CoreOutput } from './../../common/common.interface';
import { Party } from './../entities/party.entity';
export class GetPartyByIdOutput extends CoreOutput {
  party?: Party;
}
