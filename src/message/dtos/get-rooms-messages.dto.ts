import { CoreOutput } from './../../common/common.interface';

export class IMessage {
  content: string;
  isMe: boolean;
  sentAt: Date;
  isRead?: boolean;
}
export class GetRoomsMessagesOutput extends CoreOutput {
  messages?: IMessage[];
}
