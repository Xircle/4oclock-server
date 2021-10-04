import { CreatePlaceInput } from './create-place.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class Review {
  reviewImageFile: Express.Multer.File;
  description: string;
}

export class EditPlaceInput extends PartialType(CreatePlaceInput) {
  @ApiProperty({
    example: '[{reviewImageFile: new File(), description: 정말 맛있어요! }]',
    description: '리뷰 데이터',
  })
  @IsString()
  @IsOptional()
  reviewImages: Review[];
}
