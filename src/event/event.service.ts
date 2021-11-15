import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEventBannerInput } from './dtos/create-event-banner.dto';
import { EventBannerRepository } from './repositories/event-banner.repository';
import { EventName } from './entities/event-banner.entity';
import { S3Service } from '@aws/s3/s3.service';
import { User } from '@user/entities/user.entity';
import { CoreOutput } from '@common/common.interface';

@Injectable()
export class EventService {
  constructor(
    private readonly eventBannerRepo: EventBannerRepository,
    private readonly s3Service: S3Service,
  ) {}

  async getRandomEventBanner(
    eventName: EventName,
  ): Promise<string> | undefined {
    try {
      const eventBanner = await this.eventBannerRepo.findRandomEventBanner(
        eventName,
      );
      if (!eventBanner?.eventImageUrl) return undefined;
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
