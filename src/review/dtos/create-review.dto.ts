import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewInput {
  @ApiProperty({
    example: '열공 재밌었습니다~',
    description: '후기 설명',
  })
  description: string;
}
