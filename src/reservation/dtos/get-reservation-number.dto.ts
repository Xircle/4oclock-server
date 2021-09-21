import { StartTime } from './../entities/reservation.entity';
import { CoreOutput } from 'src/common/common.interface';

export class GetReservationParticipantNumberOutput extends CoreOutput {
  info?: [
    {
      startTime: StartTime;
      participantNumber: number;
    },
    {
      startTime: StartTime;
      participantNumber: number;
    },
  ];
}
