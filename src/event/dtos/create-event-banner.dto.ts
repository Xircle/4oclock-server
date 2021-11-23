import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EventName } from '../entities/event-banner.entity';

export class CreateEventBannerInput {
  @ApiProperty({
    name: '이벤트 이름',
    example: 'halloween',
  })
  @IsNotEmpty()
  @IsEnum(EventName)
  eventName: EventName;
}
