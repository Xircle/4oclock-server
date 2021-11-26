import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoreOutput } from '@common/common.interface';
import { Twilio } from 'twilio';
import { SendVerificationDto } from './dtos/send-verification.dto';
import { ConfirmPhoneNumberDto } from './dtos/confirm-phoneNumber-dto';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;

  constructor(private readonly configService: ConfigService) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendVerificationSMS({
    phoneNumber,
  }: SendVerificationDto): Promise<CoreOutput> {
    const serviceSid = this.configService.get(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );

    try {
      await this.twilioClient.verify.services(serviceSid).verifications.create({
        to: phoneNumber,
        channel: 'sms',
        locale: 'ko',
      });
      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async confirmPhoneNumber({
    phoneNumber,
    code,
  }: ConfirmPhoneNumberDto): Promise<CoreOutput> {
    try {
      const serviceSid = this.configService.get(
        'TWILIO_VERIFICATION_SERVICE_SID',
      );

      const result = await this.twilioClient.verify
        .services(serviceSid)
        .verificationChecks.create({ to: phoneNumber, code });

      if (!result.valid || result.status !== 'approved') {
        return {
          ok: false,
          error: '인증코드가 정확하지 않습니다.',
        };
      }
      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
