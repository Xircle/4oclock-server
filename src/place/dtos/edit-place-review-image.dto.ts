import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EditPlaceReviewImagesInput {
  @ApiProperty({
    example: '정말 맛있네요~!^^',
    description: '리뷰 설명',
  })
  @IsString()
  description: string;
}
