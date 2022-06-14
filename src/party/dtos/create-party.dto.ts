import { CoreOutput } from '@common/common.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { isString } from 'lodash';
export class CreatePartyInput {}

export class CreatePartyOutput extends CoreOutput {
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
  kakaoId: string;

  @ApiProperty({
    example: 'XX시 XX구 XX동 등등',
    description: '카카오 로컬 api에서 가져온 장소 api 정보',
  })
  @IsString()
  kakaoAddress?: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsString()
  invitationInstruction?: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsString()
  invittationDetail?: string;
}
