import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@user/entities/user-profile.entity';
import { CoreOutput } from '@common/common.interface';

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
  @Transform((param) => JSON.parse(param.obj?.isGraduate))
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
    example: '친해지면 말 많아요 / 드립력 상 / 조용하고 성실함',
    description: '성격',
  })
  @IsString()
  @IsOptional()
  personality: string;

  @ApiProperty({
    example: 'ESFP, ENPJ',
    description: 'mbti 16가지',
  })
  @IsString()
  @IsOptional()
  MBTI: string;

  @ApiProperty({
    example: '0',
    description:
      '0 : 안마셔요, 1: 가끔, 2: 술은 내 동반자, 3: 피할 수 없을 때만, 5: 메뉴가 좋을 때만',
  })
  @Transform((param) => JSON.parse(param.obj?.drinkingStyle))
  drinkingStyle: number;

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
