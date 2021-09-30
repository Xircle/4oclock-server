import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CoreOutput } from 'src/common/common.interface';
import { StartTime } from './../entities/reservation.entity';

export class MakeReservationDto {
  @ApiProperty({
    name: 'placeId',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  placeId: string;

  @ApiProperty({
    name: 'StartTime',
    enum: StartTime,
  })
  @IsEnum(StartTime)
  @IsNotEmpty()
  startTime: StartTime;

  @ApiProperty({
    name: 'isVaccinated',
    description: '백신 2차 접종 유무',
  })
  @IsNotEmpty()
  isVaccinated: boolean;
}

export class MakeReservationOutput extends CoreOutput {}
