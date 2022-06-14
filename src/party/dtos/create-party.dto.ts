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
}
