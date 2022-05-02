import { Place } from '@place/entities/place.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  PaginationInput,
  PagincationOutput,
} from './../../common/dtos/pagination.dto';
export class SearchPlaceInput extends PaginationInput {
  @ApiProperty({
    example: '꼭그닭',
    description: '장소 검색',
  })
  query: string;
}

export class SearchPlaceOutput extends PagincationOutput {
  places?: Place[];
}
