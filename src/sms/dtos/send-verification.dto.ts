import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendVerificationDto {
  @ApiProperty({
    example: '+8201071256035',
    description: '휴대전화',
  })
  @IsString()
  phoneNumber: string;
}
