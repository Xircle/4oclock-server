import { CoreOutput } from '@common/common.interface';

export interface IRoom {
  id: string;
  receiver: {
    id: string;
    profileImageUrl: string;
    username: string;
  };
  lastMessage: {
    isMe: boolean;
    isRead: boolean;
    content: string;
  };
  latestMessageAt: Date;
}

export class GetRoomsOutput extends CoreOutput {
  myRooms?: IRoom[];
  hasUnreadMessage?: boolean;
}
