import { CreateEventBannerInput } from './dtos/create-event-banner.dto';
import { S3Service } from 'src/aws/s3/s3.service';
import { User } from 'src/user/entities/user.entity';
import { CoreOutput } from 'src/common/common.interface';
import { EventBannerRepository } from './repositories/event-banner.repository';
import { EventName } from './entities/event-banner.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class EventService {
  constructor(
    private readonly eventBannerRepo: EventBannerRepository,
    private readonly s3Service: S3Service,
  ) {}

  async getRandomEventBanner(eventName: EventName) {
    try {
      const eventBanner = await this.eventBannerRepo.findRandomEventBanner(
        eventName,
      );
      return eventBanner.eventImageUrl;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async createEventBanner(
    authUser: User,
    bannerFile: Express.Multer.File,
    { eventName }: CreateEventBannerInput,
  ): Promise<CoreOutput> {
    try {
      const S3BannerImageUrl = await this.s3Service.uploadToS3(
        bannerFile,
        authUser.id,
      );

      await this.eventBannerRepo.save({
        eventName,
        eventImageUrl: S3BannerImageUrl,
      });
      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
