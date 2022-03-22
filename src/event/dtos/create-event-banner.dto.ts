import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EventName } from '../entities/event-banner.entity';

export class CreateEventBannerInput {
  @ApiProperty({
    name: '이벤트 이름',
    example: 'halloween',
  })
  @IsNotEmpty()
  @IsEnum(EventName)
  eventName: EventName;

  @IsString()
  mainHeading?: string;

  @IsString()
  subHeading?: string;

  @IsString()
  linkUrl?: string;
}

export class EventPhotoInput {
  mainImage: Express.Multer.File;
}
