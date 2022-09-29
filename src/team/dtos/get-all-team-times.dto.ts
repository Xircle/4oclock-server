import { CoreOutput } from './../../common/common.interface';
export class TeamTimeData {
  meetingDay?: number;
  meetingHour?: number;
  meetingMinute?: number;
}

export class GetAllTeamTimeOutput extends CoreOutput {
  data?: TeamTimeData[];
}
