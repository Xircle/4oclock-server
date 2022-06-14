import { CoreOutput } from '@common/common.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
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
    example: 'https://kakao.link',
    description: '카카오 링크',
  })
  @IsString()
  @IsOptional()
  externalLink?: string;
}
