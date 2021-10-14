import { IsString } from 'class-validator';

export class JoinRoomData {
  @IsString()
  roomId: string;

  @IsString()
  anonymouseId: string;
}
