import { User } from './../../user/entities/user.entity';
import { SocialProfile } from './../../common/common.interface';
import { CoreOutput } from 'src/common/common.interface';
import { Gender } from 'src/user/entities/user-profile.entity';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class SocialRegisterInput {
  @IsString()
  @IsNotEmpty()
  socialId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  // From this, profile data comes
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  university: string;

  @IsBoolean()
  @IsNotEmpty()
  isGraduate: boolean;

  @IsNumber()
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

  @IsBoolean()
  @IsNotEmpty()
  isMarketingAgree: boolean;
}
export class SocialRegisterOutput extends CoreOutput {}

export class SocialRedirectInput extends SocialProfile {}
export class SocialRedirectOutput extends CoreOutput {
  code?: number;
  user?: User;
}
