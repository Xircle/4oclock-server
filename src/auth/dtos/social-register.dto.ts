import { User } from './../../user/entities/user.entity';
import { SocialProfile } from './../../common/common.interface';
import { CoreOutput } from 'src/common/common.interface';
import { Gender } from 'src/user/entities/user-profile.entity';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class SocialRegisterInput {
  @IsString()
  @IsNotEmpty()
  socialId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  // From this, profile data comes
  @IsPhoneNumber('KR')
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  university: string;

  @IsNotEmpty()
  isGraduate: boolean;

  @IsNotEmpty()
  age: number;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  job: string;

  @IsString()
  @IsNotEmpty()
  shortBio: string;

  @IsString()
  @IsOptional()
  location?: string | null;

  @IsString({
    each: true,
  })
  @IsOptional()
  interests?: string[] | null;

  @IsNotEmpty()
  isMarketingAgree: boolean;
}
export class SocialRegisterOutput extends CoreOutput {}

export class SocialRedirectOutput extends CoreOutput {
  code?: number;
  data?: {
    uid: string;
    username: string;
    email: string;
    token: string;
    profile: {
      id: string;
      thumbnail: string;
    };
  };
}
