import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CoreOutput } from '@common/common.interface';

export class MakeReservationDto {
  @ApiProperty({
    name: 'placeId',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  placeId: string;

  @ApiProperty({
    name: 'isVaccinated',
    description: '백신 2차 접종 유무',
  })
  @IsNotEmpty()
  isVaccinated: boolean;
}

export class MakeReservationOutput extends CoreOutput {}
