import { GetRoomsMessagesOutput } from './dtos/get-rooms-messages.dto';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { SendMessageInput } from './dtos/send-message.dto';
import { CoreOutput } from './../common/common.interface';
import { User } from 'src/user/entities/user.entity';
import { MessageService } from './message.service';
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
import { GetUser } from 'src/auth/decorators/get-user.decorator';

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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(40), ParseIntPipe) limit: number = 40,
  ): Promise<GetRoomsMessagesOutput> {
    return this.messageService.getRoomsMessages(
      authUser,
      roomId,
      receiverId,
      page,
      limit,
    );
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
