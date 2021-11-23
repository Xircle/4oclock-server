import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyAdminInput {
  @ApiProperty({
    name: '어드민 패스워드',
    example: 'admin-1234',
  })
  @IsString()
  password: string;
}
