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
  @ApiProperty({
    example: 'https://aws.sdk.12oasdksa.png',
    description: '프로필 이미지 url',
  })
  @IsString()
  @IsOptional()
  profileImageUrl: string;

  @ApiProperty({
    example: '1235412312',
    description: '카카오에서 제공하는 소셜 아이디',
  })
  @IsString()
  @IsNotEmpty()
  socialId: string;

  @ApiProperty({
    example: 'she_lock@naver.com',
    description: '카카오 계정',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // From this, profile data comes
  @ApiProperty({
    example: '01071256035',
    description: '휴대전화',
  })
  @IsPhoneNumber('KR')
  phoneNumber: string;

  @ApiProperty({
    example: 'she_lock@naver.com',
    description: '카카오 닉네임',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: '고려대학교',
    description: '대학교',
  })
  @IsString()
  @IsNotEmpty()
  university: string;

  @ApiProperty({
    description: '대학 졸업 유무',
  })
  @IsNotEmpty()
  isGraduate: boolean;

  @ApiProperty({
    description: '나이',
    type: Number,
  })
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    description: '성별',
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    example: '심심한 새내기',
    description: '직업',
  })
  @IsString()
  @IsNotEmpty()
  job: string;

  @ApiProperty({
    example: '써클에서 좋은 인연 만나보고싶습니다~',
    description: '짧은 자기소개',
  })
  @IsString()
  @IsNotEmpty()
  shortBio: string;

  @ApiProperty({
    example: '인사이더스 12기',
    description: '활동이력',
  })
  @IsString()
  @IsOptional()
  activities: string;

  @ApiProperty({
    example: '서울시 강남구 신사동',
    description: '나의 현재 위치',
  })
  @IsString()
  @IsOptional()
  location?: string | null;

  @ApiProperty({
    example: '[맛집탐방, 축구]',
    description: '관심사',
    type: [String],
  })
  @IsString({
    each: true,
  })
  @IsOptional()
  interests?: string[] | null;

  @ApiProperty({
    description: '마케팅 동의 여부',
  })
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
