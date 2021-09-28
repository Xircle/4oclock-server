import { CoreOutput } from 'src/common/common.interface';
import { MainFeedPlaceParticipantsProfile } from './get-place-by-location.dto';

export class GetPlaceParticipantListOutput extends CoreOutput {
  participants?: MainFeedPlaceParticipantsProfile[];
}
