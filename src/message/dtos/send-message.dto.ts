import { CoreOutput } from './../../common/common.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class SendMessageInput {
  @ApiProperty({
    example: '반가워요~! 첫 메세지~',
    description: '채팅 내용',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 'as2232saidjiio1j21nd5',
    description: '받는 유저 아이디',
  })
  @IsString()
  receiverId: string;

  @ApiProperty({
    example: 'true',
    description: '실시간으로 유저가 읽었는지 아닌지',
  })
  @Transform((param) => JSON.parse(param.obj?.isRead))
  isRead: boolean;

  @ApiProperty({
    example: 'new Date()',
    description: '메세지 보낸 시각',
  })
  @IsDate()
  sentAt: Date;
}

export class SendMessageOutput extends CoreOutput {
  createdRoomId?: string;
}
