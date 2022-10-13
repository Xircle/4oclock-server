import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { isNumber } from 'lodash';
export class CreateTeamInput {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  season?: number;

  @IsString()
  @IsUUID()
  @IsOptional()
  leaderId?: string;

  @IsString()
  @IsOptional()
  leaderPhoneNumber?: string;
  @IsString()
  @IsOptional()
  areaInfo?: string;

  @IsString()
  @IsOptional()
  question?: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  maxParticipant?: number;

  @IsNumber()
  @IsOptional()
  minAge?: number;

  @IsNumber()
  @IsOptional()
  maxAge?: number;

  @IsNumber()
  @IsOptional()
  meetingDay?: number;

  @IsNumber()
  @IsOptional()
  meetingHour?: number;

  @IsNumber()
  @IsOptional()
  meetingMinute?: number;

  @ApiProperty({
    description: 'images',
    type: 'array',
    maxItems: 16,
    required: true,
    items: {
      type: 'file',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  images: Express.Multer.File[];
}

export class TeamPhotoInput {
  images: Express.Multer.File[];
}
