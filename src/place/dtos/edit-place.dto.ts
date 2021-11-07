import { ApiProperty } from '@nestjs/swagger';
import { Place } from 'src/place/entities/place.entity';
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
}
