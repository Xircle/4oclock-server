import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateReviewInput {
  @ApiProperty({
    example: '열공 재밌었습니다~',
    description: '후기 설명',
  })
  description: string;
  placeId: string;
}
