import { IsString } from 'class-validator';

export class SendMessageData {
  @IsString()
  roomId: string;

  @IsString()
  receiverId: string;

  @IsString()
  senderId: string;

  @IsString()
  content: string;
}
