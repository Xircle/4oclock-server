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
}

export class MakeReservationOutput extends CoreOutput {}
