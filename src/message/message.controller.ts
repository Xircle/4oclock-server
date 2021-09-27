import { Controller } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Message')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@Controller('message')
export class MessageController {}
