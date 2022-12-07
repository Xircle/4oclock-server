import { ApplicationStatus } from './../../application/entities/application.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
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

  @IsOptional()
  @IsString()
  isCanceled?: string;

  @IsOptional()
  @IsString()
  paid?: string;

  @IsOptional()
  @IsString()
  isCancelRequested?: string;

  @IsOptional()
  @IsString()
  cancelReason?: string;
}

export class ApplicationData {
  id: string;
  status?: ApplicationStatus;
  user_id?: string;
  team_id?: number;
  paid?: boolean;
  createdAt?: Date;
  isCanceled?: boolean;
}
