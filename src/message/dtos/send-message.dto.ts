import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate } from 'class-validator';

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
    example: 'new Date()',
    description: '메세지 보낸 시각',
  })
  @IsDate()
  sentAt: Date;
}
