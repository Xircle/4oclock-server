import { Message } from './../entities/message.entity';
import { CoreOutput } from './../../common/common.interface';

export class GetRoomsMessagesOutput extends CoreOutput {
  messages?: Message[];
}
