import { Message } from './../../message/entities/message.entity';
import { CoreOutput } from 'src/common/common.interface';

export class GetRoomMessagesOutput extends CoreOutput {
  messages?: Message[];
}
