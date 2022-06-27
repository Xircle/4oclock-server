import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('notification')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {}
