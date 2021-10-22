import { AuthModule } from './../auth/auth.module';
import { S3Service } from 'src/aws/s3/s3.service';
import { EventBannerRepository } from './repositories/event-banner.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([EventBannerRepository])],
  providers: [EventService, S3Service],
  controllers: [EventController],
})
export class EventModule {}
