import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteReservationInput {
  @ApiProperty({
    name: 'cancelReason',
    description: '취소사유',
  })
  @IsString()
  cancelReason: string;

  @ApiProperty({
    name: 'detailReason',
    description: '상세사유',
  })
  @IsString()
  detailReason: string;
}
