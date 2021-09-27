import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPhoneNumber, IsString, Length } from 'class-validator';
import { CoreOutput } from './../../common/common.interface';

export class CreateUserInput {
  @ApiProperty({
    description: '이메일',
  })
  @IsString()
  @Length(5, 20)
  email: string;

  @ApiProperty({
    description: '패스워드',
  })
  @IsString()
  @Length(5, 20)
  password: string;
}
export class CreateUserOutput extends CoreOutput {}

export class LoginUserInput {
  @ApiProperty({
    description: '이메일',
  })
  @IsString()
  @Length(5, 20)
  email: string;

  @ApiProperty({
    description: '이메일',
  })
  @IsString()
  @Length(5, 20)
  password: string;
}
export class LoginUserOutput extends CoreOutput {
  accessToken?: string | null;
}
