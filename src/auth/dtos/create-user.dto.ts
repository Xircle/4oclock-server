import { IsNumber, IsPhoneNumber, IsString, Length } from 'class-validator';
import { CoreOutput } from './../../common/common.interface';

export class CreateUserInput {
  @IsString()
  @Length(5, 20)
  email: string;

  @IsString()
  @Length(5, 20)
  password: string;
}
export class CreateUserOutput extends CoreOutput {}

export class LoginUserInput {
  @IsString()
  @Length(5, 20)
  email: string;

  @IsString()
  @Length(5, 20)
  password: string;
}
export class LoginUserOutput extends CoreOutput {
  accessToken?: string | null;
}
