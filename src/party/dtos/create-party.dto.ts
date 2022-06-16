import { BadRequestException } from '@nestjs/common';
import { CoreOutput } from '@common/common.interface';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { isString } from 'lodash';
import { Transform } from 'class-transformer';
export class CreatePartyInput {
  @ApiProperty({
    example: '춘자 카페',
    description: '장소 이름',
  })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '준비물은 청춘과 체력! 같이 이런저런 얘기 나눠요~~',
    description: '파티 디테일 설명',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '',
    description: '외부 링크',
  })
  @IsString()
  @IsOptional()
  externalLink?: string;

  @ApiProperty({
    example: '11111',
    description: '카카오 플레이스 아이디',
  })
  @IsString()
  @IsOptional()
  kakaoPlaceId?: string;

  @IsString()
  @IsOptional()
  kakaoPlaceName?: string;

  @ApiProperty({
    example: 'XX시 XX구 XX동 등등',
    description: '카카오 로컬 api에서 가져온 장소 api 정보',
  })
  @IsString()
  @IsOptional()
  kakaoAddress?: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsString()
  @IsOptional()
  invitationInstruction?: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsString()
  @IsOptional()
  invitationDetail?: string;

  @IsString()
  @IsOptional()
  fee?: string;

  @ApiProperty({
    example: '2021-11-29T05:35:14.757Z',
    description: '미팅 시작 날짜',
  })
  @IsDate()
  @IsNotEmpty()
  startDateAt: Date;

  @Transform((param) => {
    try {
      return JSON.parse(param?.obj.maxParticipantsCount);
    } catch {
      throw new BadRequestException(
        'maxParticipantsCount는 number 타입입니다.',
      );
    }
  })
  @IsNotEmpty()
  maxParticipantsCount?: number;

  participatingRecommendations?: string[];
}

export class CreatePartyOutput extends CoreOutput {}

export class PartyPhotoInput {
  images: Express.Multer.File[];
}
