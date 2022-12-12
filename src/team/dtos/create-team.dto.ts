import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
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
  maleMinAge?: number;

  @IsNumber()
  @IsOptional()
  maleMaxAge?: number;

  @IsNumber()
  @IsOptional()
  femaleMinAge?: number;

  @IsNumber()
  @IsOptional()
  femaleMaxAge?: number;

  category_id: string;

  @IsNumber()
  @IsOptional()
  meetingDay?: number;

  @IsNumber()
  @IsOptional()
  meetingHour?: number;

  @IsNumber()
  @IsOptional()
  meetingMinute?: number;

  leaderIntro?: string;

  @IsArray()
  @IsOptional()
  areaIds?: string[];

  @IsArray()
  @IsOptional()
  activity_titles?: string[];

  @IsArray()
  @IsOptional()
  activity_details?: string[];

  @IsString()
  @IsOptional()
  mission?: string;

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
