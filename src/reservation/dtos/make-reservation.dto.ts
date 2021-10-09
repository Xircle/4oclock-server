import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CoreOutput } from 'src/common/common.interface';

export class MakeReservationDto {
  @ApiProperty({
    name: 'placeId',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  placeId: string;

  @ApiProperty({
    name: 'startTime',
    description: '시작 시간',
  })
  @IsNotEmpty()
  startTime: number;

  @ApiProperty({
    name: 'isVaccinated',
    description: '백신 2차 접종 유무',
  })
  @IsNotEmpty()
  isVaccinated: boolean;
}

export class MakeReservationOutput extends CoreOutput {}
