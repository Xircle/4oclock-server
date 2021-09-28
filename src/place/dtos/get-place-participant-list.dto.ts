import { CoreOutput } from 'src/common/common.interface';
import { MainFeedPlaceParticipantsProfile } from './get-place-by-location.dto';

export class PlaceParticipantListDataProfile extends MainFeedPlaceParticipantsProfile {}

export class PlaceParticipantListData {
  participantListProfiles: PlaceParticipantListDataProfile[];
  participantsInfo: {
    total_count: number;
    male_count: number;
    average_age: number;
  };
}

export class GetPlaceParticipantListOutput extends CoreOutput {
  participants?: PlaceParticipantListData;
}
