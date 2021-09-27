import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CoreOutput } from 'src/common/common.interface';
import { StartTime } from './../entities/reservation.entity';

export class MakeReservationDto {
  @ApiProperty({
    name: '장소 id',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  placeId: string;

  @ApiProperty({
    name: '시작 시간',
    enum: StartTime,
  })
  @IsEnum(StartTime)
  @IsNotEmpty()
  startTime: StartTime;

  @ApiProperty({
    name: '백신 2차 접종 유무',
  })
  @IsNotEmpty()
  isVaccinated: boolean;
}

export class MakeReservationOutput extends CoreOutput {}
