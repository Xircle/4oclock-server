import { PartyRepository } from './repositories/party.repository';
import { CreatePartyInput, PartyPhotoInput } from './dtos/create-party.dto';
import { User } from '@user/entities/user.entity';
import { CoreOutput } from '@common/common.interface';
import { NotificationService } from 'notification/notification.service';
import { ReservationRepository } from '@reservation/repository/reservation.repository';
import { S3Service } from '@aws/s3/s3.service';
import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';

@Injectable()
export class PartyService {
  constructor(
    private partyRepository: PartyRepository,
    private s3Service: S3Service,
    private notificationService: NotificationService,
  ) {}

  public async createParty(
    authUser: User,
    createPartyInput: CreatePartyInput,
    partyPhotoInput: PartyPhotoInput,
  ): Promise<CoreOutput> {
    try {
      const {
        name,
        description,
        externalLink,
        kakaoPlaceId,
        kakaoAddress,
        invitationInstruction,
        invitationDetail,
      } = createPartyInput;
      const { images } = partyPhotoInput;

      const imageS3Urls: string[] = [];
      if (images) {
        for (const image of images) {
          const s3_url = await this.s3Service.uploadToS3(image, authUser.id);
          imageS3Urls.push(s3_url);
        }
      }
      //   Transction start
      //   await getManager().transaction(async (transactionalEntityManager) => {
      //     //   Create place
      //     const party = await this.partyRepository.createAndSavePlace(
      //       {
      //         kakaoPlaceId: placeId,
      //         coverImage: coverImageS3Url,
      //         subImages: subImageS3Urls,
      //         placeType,
      //         name,
      //         startDateAt,
      //         team,
      //         recommendation,
      //         creator: authUser,
      //       },
      //       transactionalEntityManager,
      //     );
      //   });

      return {
        ok: true,
      };
    } catch (error) {}
    return { ok: true };
  }
}
