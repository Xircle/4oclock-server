import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { CoreOutput } from '@common/common.interface';
import { Exclude, Expose } from 'class-transformer';

export class CreateUserInput {
  @ApiProperty({
    description: '이메일',
  })
  @IsString()
  @Length(5, 20)
  @Expose()
  email: string;

  @ApiProperty({
    description: '패스워드',
  })
  @IsString()
  @Length(5, 20)
  @Exclude()
  password: string;
}
export class CreateUserOutput extends CoreOutput {}

export class LoginUserInput {
  @ApiProperty({
    description: '이메일',
  })
  @IsString()
  @Length(5, 20)
  @Expose()
  email: string;

  @ApiProperty({
    description: '이메일',
  })
  @IsString()
  @Length(5, 20)
  @Exclude()
  password: string;
}
export class LoginUserOutput extends CoreOutput {
  accessToken?: string | null;
}
