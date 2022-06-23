import { CoreOutput } from '@common/common.interface';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PlaceType } from '@place/entities/place.entity';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePlaceInput {
  @ApiProperty({
    example: '1as223asd',
    description: '카카오 placeId',
  })
  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsOptional()
  notParticipating?: boolean;

  @ApiProperty({
    example: 'https://kakao.link',
    description: '카카오 링크',
  })
  @IsString()
  @IsOptional()
  kakaoLink?: string;

  @ApiProperty({
    example: '춘자 카페',
    description: '장소 이름',
  })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '고대에서 가장 시원한 맥주집!',
    description: '장소 설명 제목',
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: '준비물은 청춘과 체력! 같이 이런저런 얘기 나눠요~~',
    description: '장소 디테일 설명',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '4',
    description: '모임 인원수',
  })
  @Transform((param) => {
    try {
      return JSON.parse(param?.obj?.maxParticipantsNumber);
    } catch {
      throw new BadRequestException(
        'maxParticipantsNumber는 number 타입입니다.',
      );
    }
  })
  maxParticipantsNumber: number;

  @ApiProperty({
    example: '안암',
    nullable: true,
    description: '장소의 대학가 주변 위치',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    example: '안암에 이런 집은 없었다.',
    nullable: true,
    description: '장소 한줄소개',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  oneLineIntroText?: string;

  @ApiProperty({
    example: '3000',
    description: '참가비',
  })
  @Transform((param) => {
    try {
      return JSON.parse(param?.obj.participationFee);
    } catch {
      throw new BadRequestException('participationFee는 number 타입입니다.');
    }
  })
  @IsNotEmpty()
  participationFee: number;

  @ApiProperty({
    example: '나이 20 ~ 25 중간',
    description: '연령대 권장사항',
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  recommendation?: string;

  @ApiProperty({
    example: '2021-11-29T05:35:14.757Z',
    description: '미팅 시작 날짜',
  })
  @IsDate()
  @IsNotEmpty()
  startDateAt: Date;

  @ApiProperty({
    example: '서울 강남구 강남대로 152길 42 2층',
    description: '장소 디테일 위치',
  })
  @IsString()
  @IsNotEmpty()
  detailAddress: string;

  @ApiProperty({
    example: 'T조',
    description: '팀 이름',
  })
  @IsString()
  @IsOptional()
  team?: string;

  @ApiProperty({
    example: 'https://map.naver.com',
    nullable: true,
    description: '맛집 정보 더보기',
    required: false,
  })
  @IsString()
  @IsOptional()
  detailLink?: string;

  @IsArray()
  @IsString({
    each: true,
  })
  @IsOptional()
  qAndA?: string[];

  @ApiProperty({
    example: 'All',
    enum: PlaceType,
    enumName: 'PlaceType',
    description: '장소의 종류',
  })
  @IsEnum(PlaceType)
  @IsNotEmpty()
  placeType: PlaceType;

  @ApiProperty({
    description: 'coverImage',
    required: true,
    type: 'string',
    format: 'binary',
  })
  coverImage: Express.Multer.File;

  @ApiProperty({
    description: 'subImages',
    type: 'array',
    maxItems: 16,
    required: true,
    items: {
      type: 'file',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  subImages: Express.Multer.File[];
}
export class PlacePhotoInput {
  coverImage: Express.Multer.File[];
  subImages?: Express.Multer.File[];
}

export class CreatePlaceOutput extends CoreOutput {}
