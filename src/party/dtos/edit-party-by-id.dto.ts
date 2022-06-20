import { CreatePartyInput } from './create-party.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class EditPartyByIdInput extends PartialType(CreatePartyInput) {
  @ApiProperty({
    example:
      '{https://xircle-profile-upload.s3.ap-northeast-2.amazonaws.com/uploads/-16943905-0a91-4684-93b7-e0979e005949-1650895713186-A265814F-E69F-49C0-A004-C7295A9191BC.jpg}',
    description: 'subImageUrls',
  })
  oldImageUrls: string[];
}

export class EditPlacePhotoInput {
  images?: Express.Multer.File[];
}
