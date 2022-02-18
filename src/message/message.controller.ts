import {
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Body,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@user/entities/user.entity';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { CoreOutput } from '@common/common.interface';
import { GetRoomsMessagesOutput } from './dtos/get-rooms-messages.dto';
import { SendMessageInput } from './dtos/send-message.dto';
import { MessageService } from './message.service';
import { isUnreadMessageOutput } from './dtos/is-unread-message.dto';

@ApiTags('Message')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('room')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('/:roomId/messages/:receiverId')
  @ApiOperation({ summary: '채팅방 내 메세지 모두 가져오기' })
  getRoomsMessages(
    @GetUser() authUser: User,
    @Param('roomId') roomId: string,
    @Param('receiverId') receiverId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(40), ParseIntPipe) limit: number,
  ): Promise<GetRoomsMessagesOutput> {
    return this.messageService.getRoomsMessages(
      authUser,
      roomId,
      receiverId,
      page,
      limit,
    );
  }

  @Get('/unread')
  @ApiOperation({
    summary: 'returns true if there is unread message, otherwise returns false',
  })
  isUnreadMessages(@GetUser() authUser: User): Promise<isUnreadMessageOutput> {
    return this.messageService.isUnReadMessage(authUser);
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
