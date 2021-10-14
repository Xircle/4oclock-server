import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { SendMessageInput } from './dtos/send-message.dto';
import { CoreOutput } from './../common/common.interface';
import { User } from 'src/user/entities/user.entity';
import { MessageService } from './message.service';
import { Controller, Get, Post, UseGuards, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Message')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('room')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('/:roomId/messages')
  @ApiOperation({ summary: '채팅방 내 메세지 모두 가져오기' })
  getRoomsMessages(@GetUser() authUser: User, @Param('roomId') roomId: string) {
    return this.messageService.getRoomsMessages(authUser, roomId);
  }

  @Post('/:roomId/messages')
  @ApiOperation({ summary: '채팅방 내 메세지 생성하기' })
  sendMessage(
    @GetUser() authUser: User,
    @Param('roomId') roomId: string,
    @Body() sendMessageInput: SendMessageInput,
  ): Promise<CoreOutput> {
    return this.messageService.sendMessage(authUser, roomId, sendMessageInput);
  }
}
