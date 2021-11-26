import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmPhoneNumberDto {
  @ApiProperty({
    example: '01071256035',
    description: '휴대전화',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: '426387',
    description: '인증코드',
  })
  code: string;
}
