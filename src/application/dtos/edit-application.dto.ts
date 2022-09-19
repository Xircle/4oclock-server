import { ApplicationStatus } from './../../application/entities/application.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateApplicationInput } from './create-application.dto';
export class EditApplicationInput {
  @IsNotEmpty()
  @IsString()
  applicationId: string;

  @ApiProperty({
    name: '지원 상태',
    example: 'Pending',
  })
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;
}
