import { SmsService } from './sms.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SendVerificationDto } from './dtos/send-verification.dto';
import { ConfirmPhoneNumberDto } from './dtos/confirm-phoneNumber-dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Place')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@Controller('sms')
export class SmsController {
  constructor(private smsService: SmsService) {}

  @Post('send')
  async sendVerificationSMS(@Body() sendVerificationDto: SendVerificationDto) {
    return this.smsService.sendVerificationSMS(sendVerificationDto);
  }

  @Post('confirm')
  async confirmPhoneNumber(
    @Body() confirmPhoneNumberDto: ConfirmPhoneNumberDto,
  ) {
    return this.smsService.confirmPhoneNumber(confirmPhoneNumberDto);
  }
}
