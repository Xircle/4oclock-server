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
import { ApiProperty } from '@nestjs/swagger';

export class SocialRegisterInput {
  @ApiProperty()
  @IsString()
  @IsOptional()
  profileImageUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  socialId: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // From this, profile data comes
  @ApiProperty()
  @IsPhoneNumber('KR')
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  university: string;

  @ApiProperty()
  @IsNotEmpty()
  isGraduate: boolean;

  @ApiProperty()
  @IsNotEmpty()
  age: number;

  @ApiProperty()
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  job: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shortBio: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location?: string | null;

  @ApiProperty()
  @IsString({
    each: true,
  })
  @IsOptional()
  interests?: string[] | null;

  @ApiProperty()
  @IsNotEmpty()
  isMarketingAgree: boolean;
}

export class AuthDataToFront {
  uid: string;
  username: string;
  email: string;
  token: string;
  profile: {
    id: string;
    thumbnail: string;
  };
}

export class SocialRegisterOutput extends CoreOutput {
  data?: AuthDataToFront;
}

export class SocialRedirectOutput extends CoreOutput {
  code?: number;
  data?: AuthDataToFront;
}
