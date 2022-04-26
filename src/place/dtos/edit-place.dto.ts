import { ApiProperty } from '@nestjs/swagger';
import { Place } from '@place/entities/place.entity';
import { PlaceDetail } from './../entities/place-detail.entity';

export class EditPlaceInput {
  @ApiProperty({
    example: '{ name: 매운탕집!, isClosed: true}',
    description: 'Place 테이블에서 변경할 사항',
  })
  editedPlace: Partial<Omit<Place, 'coverImage'>>;

  @ApiProperty({
    example: '{ title: 잊을수가 없다!, categories: [맥주, 호프]}',
    description: 'PlaceDetail 테이블에서 변경할 사항',
  })
  editedPlaceDetail: Partial<PlaceDetail>;

  @ApiProperty({
    example:
      '{https://xircle-profile-upload.s3.ap-northeast-2.amazonaws.com/uploads/-16943905-0a91-4684-93b7-e0979e005949-1650895713186-A265814F-E69F-49C0-A004-C7295A9191BC.jpg}',
    description: 'subImageUrls',
  })
  subImageUrls: string[];
}
