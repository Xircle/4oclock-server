import { ApplicationStatus } from '../entities/application.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplicationInput {
  @ApiProperty({
    name: '지원 상태',
    example: 'Pending',
  })
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @IsNotEmpty()
  teamId: number;

  @IsString()
  @IsOptional()
  content?: string;
}
