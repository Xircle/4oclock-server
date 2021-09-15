import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CoreOutput } from 'src/common/common.interface';
import { StartTime } from './../entities/reservation.entity';

export class MakeReservationDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  placeId: string;

  @IsEnum(StartTime)
  @IsNotEmpty()
  startTime: StartTime;
}

export class MakeReservationOutput extends CoreOutput {}
