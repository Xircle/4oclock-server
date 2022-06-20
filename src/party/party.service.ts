import { Party } from './entities/party.entity';
import { EditPartyByIdInput } from './dtos/edit-party-by-id.dto';
import { PartyRepository } from './repositories/party.repository';
import { CreatePartyInput, PartyPhotoInput } from './dtos/create-party.dto';
import { User } from '@user/entities/user.entity';
import { CoreOutput } from '@common/common.interface';
import { NotificationService } from 'notification/notification.service';
import { ReservationRepository } from '@reservation/repository/reservation.repository';
import { S3Service } from '@aws/s3/s3.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';

@Injectable()
export class PartyService {
  constructor(
    private partyRepository: PartyRepository,
    private s3Service: S3Service,
    private notificationService: NotificationService,
  ) {}
  private checkPartyException(entity: Party): void {
    if (!entity) {
      throw new HttpException(
        '존재하지 않는 파티입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async GetPartyByIdAndcheckPartyException(partyId: string) {
    const party = await this.partyRepository.findOneByPartyId(partyId);
    this.checkPartyException(party);
    return party;
  }
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
        startDateAt,
        maxParticipantsCount,
        participatingRecommendations,
        fee,
        kakaoPlaceName,
      } = createPartyInput;
      const { images } = partyPhotoInput;

      const imageS3Urls: string[] = [];
      if (images) {
        for (const image of images) {
          const s3_url = await this.s3Service.uploadToS3(image, authUser.id);
          imageS3Urls.push(s3_url);
        }
      }
      // Transction start
      await getManager().transaction(async (transactionalEntityManager) => {
        //   Create place
        const party = await this.partyRepository.createAndSaveParty(
          {
            kakaoPlaceId,
            images: imageS3Urls,
            description,
            name,
            startDateAt,
            externalLink,
            kakaoAddress,
            invitationInstruction,
            invitationDetail,
            maxParticipantsCount,
            participatingRecommendations,
            fee,
            kakaoPlaceName,
            isClosed: false,
          },
          transactionalEntityManager,
        );
      });

      return {
        ok: true,
      };
    } catch (error) {}
    return { ok: true };
  }

  public async editPartyById(
    authUser: User,
    editPartyByIdInput: EditPartyByIdInput,
    partyPhotoInput: PartyPhotoInput,
    partyId: string,
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
        startDateAt,
        maxParticipantsCount,
        participatingRecommendations,
        fee,
        kakaoPlaceName,
      } = editPartyByIdInput;
      const { images } = partyPhotoInput;

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
