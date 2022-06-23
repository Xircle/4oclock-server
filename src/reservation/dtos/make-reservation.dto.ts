import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CoreOutput } from '@common/common.interface';

export class MakeReservationDto {
  @ApiProperty({
    name: 'placeId',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  placeId: string;

  @IsArray()
  @IsString({
    each: true,
  })
  @IsOptional()
  qAndA?: string[];
}

export class MakeReservationOutput extends CoreOutput {}
