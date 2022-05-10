import { CreatePlaceInput } from './create-place.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class EditPlaceInput extends PartialType(CreatePlaceInput) {
  @ApiProperty({
    example:
      '{https://xircle-profile-upload.s3.ap-northeast-2.amazonaws.com/uploads/-16943905-0a91-4684-93b7-e0979e005949-1650895713186-A265814F-E69F-49C0-A004-C7295A9191BC.jpg}',
    description: 'subImageUrls',
  })
  oldSubImageUrls: string[];

  @ApiProperty({
    description: '이전 커버 이미지가 지워졌는지 판단',
  })
  isCoverImageDeleted: boolean;

  oldCoverImageUrl: string;
  @ApiProperty({
    description: 'images',
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
  images: Express.Multer.File[];
}

export class EditPlacePhotoInput {
  images?: Express.Multer.File[];
}
