import { CoreOutput } from '@common/common.interface';
import { Message } from '@message/entities/message.entity';

export class GetRoomMessagesOutput extends CoreOutput {
  messages?: Message[];
}
