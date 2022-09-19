import { ApplicationStatus } from './../entities/applications.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateApplicationInput {
  @ApiProperty({
    name: '지원 상태',
    example: 'Pending',
  })
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsNotEmpty()
  teamId: number;
}
