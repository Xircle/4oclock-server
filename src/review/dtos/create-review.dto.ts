import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateReviewInput {
  @ApiProperty({
    example: '열공 재밌었습니다~',
    description: '후기 설명',
  })
  description: string;

  @ApiProperty({
    example: 'false',
    description: '모임에 대한 대표이미지인지 아닌지',
  })
  @Transform((param) => param?.obj.isRepresentative)
  isRepresentative: boolean;
}
