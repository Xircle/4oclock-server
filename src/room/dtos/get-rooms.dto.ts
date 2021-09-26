import { Room } from './../entities/room.entity';
import { CoreOutput } from 'src/common/common.interface';

export class GetRoomsOutput extends CoreOutput {
  rooms?: Room[];
}
