import * as _ from 'lodash';
import { getManager } from 'typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ReservationRepository } from '@reservation/repository/reservation.repository';
import { ReviewRepository } from '@review/repository/review.repository';
import { S3Service } from '@aws/s3/s3.service';
import { EventService } from '@event/event.service';
import { EventName } from '@event/entities/event-banner.entity';
import { CoreOutput } from '@common/common.interface';
import { User } from '@user/entities/user.entity';
import {
  GetPlaceByIdOutput,
  PlaceData,
  PlaceDataParticipantsProfile,
} from './dtos/get-place-by-id.dto';
import {
  GetPlaceByLocationWhereOptions,
  MainFeedPlace,
} from './dtos/get-place-by-location.dto';
import {
  CreatePlaceInput,
  CreatePlaceOutput,
  PlacePhotoInput,
} from './dtos/create-place.dto';
import { PlaceRepository } from './repository/place.repository';
import { PlaceDetailRepository } from './repository/place-detail.repository';
import { EditPlaceReviewImagesInput } from './dtos/edit-place-review-image.dto';
import { EditPlaceInput } from './dtos/edit-place.dto';
import { DeletePlaceOutput } from './dtos/delete-place.dto';
import { GetPlacesByLocationOutput } from './dtos/get-place-by-location.dto';
import { DeadlineIndicator, Place } from './entities/place.entity';
import { GetPlaceParticipantListOutput } from './dtos/get-place-participant-list.dto';
import { PlaceDetail } from './entities/place-detail.entity';

@Injectable()
export class PlaceService {
  constructor(
    private reservationRepository: ReservationRepository,
    private placeRepository: PlaceRepository,
    private placeDetailRepository: PlaceDetailRepository,
    private reviewRepository: ReviewRepository,
    private s3Service: S3Service,
    private eventService: EventService,
  ) {}

  checkPlaceException(entity: Place): void {
    if (!entity) {
      throw new HttpException(
        '존재하지 않는 장소입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async GetPlaceByIdAndcheckPlaceException(placeId: string) {
    const place = await this.placeRepository.findOneByPlaceId(placeId);
    this.checkPlaceException(place);
    return place;
  }

  async getPlacesByLocation(
    location: string,
    page: number,
    limit: number,
  ): Promise<GetPlacesByLocationOutput> {
    let whereOptions: GetPlaceByLocationWhereOptions = {};
    if (location !== '전체') {
      whereOptions = {
        location,
      };
    }

    try {
      const places = await this.placeRepository.findManyPlaces({
        where: {
          ...whereOptions,
        },
        order: {
          startDateAt: 'DESC',
        },
        loadEagerRelations: false,
        take: limit,
        skip: limit * (page - 1),
      });

      const openPlaceOrderByStartDateAtDESC = _.takeWhile(
        places,
        (place) => !place.isClosed,
      );
      const closedPlaceOrderByStartDateAtDESC = _.difference(
        places,
        openPlaceOrderByStartDateAtDESC,
      );
      const openPlaceOrderByStartDateAtASC =
        openPlaceOrderByStartDateAtDESC.reverse();

      openPlaceOrderByStartDateAtASC.push(...closedPlaceOrderByStartDateAtDESC);

      const finalPlaceEntities = openPlaceOrderByStartDateAtASC;

      let mainFeedPlaces: MainFeedPlace[] = [];
      // Start to adjust output with place entity
      for (const place of finalPlaceEntities) {
        const participantsCount: number =
          await this.reservationRepository.count({
            where: {
              place_id: place.id,
              isCanceled: false,
            },
          });
        const deadline = place.getDeadlineCaption();

        // isClosed Update 로직 (참가자 수가 최대 인원일 때, 3시간 전)
        if (!place.isClosed) {
          if (
            participantsCount === place.placeDetail.maxParticipantsNumber ||
            deadline === DeadlineIndicator.Done
          ) {
            place.isClosed = true;
            await this.placeRepository.savePlace(place);
          }
        }

        const startDateFromNow = place.getStartDateFromNow();
        mainFeedPlaces.push({
          ...place,
          participantsCount,
          deadline,
          startDateFromNow,
        });
      }

      // Make place Metadata
      const placeMetadata = await this.placeRepository.getPlaceMetaData(
        page,
        limit,
      );

      // event banner
      const eventBannerImageUrl = await this.eventService.getRandomEventBanner(
        EventName.Halloween,
      );

      return {
        ok: true,
        places: mainFeedPlaces,
        meta: placeMetadata,
        eventBannerImageUrl,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getPlaceById(
    anyUser: User | undefined,
    placeId: string,
  ): Promise<GetPlaceByIdOutput> {
    try {
      const place = await this.placeRepository.findDetailPlaceByPlaceId(
        placeId,
      );
      if (!place) {
        return {
          ok: false,
          error: '존재하지 않는 장소입니다.',
        };
      }

      await this.placeRepository.updatePlace(
        {
          id: placeId,
        },
        {
          views: place.views + 1,
        },
      );

      const NotCanceledReservations =
        await this.reservationRepository.getNotCanceledReservations(placeId);

      const participantsUsername: string[] = NotCanceledReservations.map(
        (reservation) => reservation.participant.profile?.username,
      );

      // 참여 중인 크루원 수
      const participantsCount = NotCanceledReservations.length;
      // 남은 크루원 자리 수
      const leftParticipantsCount =
        place.placeDetail.maxParticipantsNumber - participantsCount;

      // 이벤트 시작 시간
      const startDateFromNow = place.getStartDateFromNow();
      // 참여 여부
      const isParticipating = await this.reservationRepository.isParticipating(
        anyUser.id,
        placeId,
      );
      const placeData: PlaceData = {
        ...place,
        reviews: place.reviews,
        isParticipating,
        participantsData: {
          participantsCount,
          leftParticipantsCount,
          participantsUsername,
        },
        startDateFromNow,
      };
      return {
        ok: true,
        placeData,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async createPlace(
    authUser: User,
    createPlaceInput: CreatePlaceInput,
    placePhotoInput: PlacePhotoInput,
  ): Promise<CreatePlaceOutput> {
    const {
      name,
      description,
      maxParticipantsNumber,
      startDateAt,
      participationFee,
      detailAddress,
    } = createPlaceInput;
    const { coverImage, reviewImages } = placePhotoInput;

    try {
      // Upload coverImage to S3 (url 생성)
      const coverImageS3Url = await this.s3Service.uploadToS3(
        coverImage[0],
        authUser.id,
      );

      // Upload Review Images to S3 (url 생성)
      const reviewImageS3Urls: string[] = [];
      for (const reviewImage of reviewImages) {
        const s3_url = await this.s3Service.uploadToS3(
          reviewImage,
          authUser.id,
        );
        reviewImageS3Urls.push(s3_url);
      }

      //   Transction start
      await getManager().transaction(async (transactionalEntityManager) => {
        //   Create place
        const place = await this.placeRepository.createAndSavePlace(
          {
            coverImage: coverImageS3Url,
            name,
            startDateAt,
          },
          transactionalEntityManager,
        );
        //  Create review (사진이 여러개인 리뷰 하나)
        await this.reviewRepository.createAndSaveReview(
          {
            user: authUser,
            imageUrls: reviewImageS3Urls,
            isRepresentative: true,
            place,
          },
          transactionalEntityManager,
        );
        //   Create place detail
        await this.placeDetailRepository.createAndSavePlaceDetail(
          {
            participationFee: +participationFee,
            description,
            maxParticipantsNumber,
            place,
            detailAddress,
          },
          transactionalEntityManager,
        );
      });

      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async deletePlace(placeId: string): Promise<DeletePlaceOutput> {
    try {
      await this.GetPlaceByIdAndcheckPlaceException(placeId);

      await this.placeRepository.delete({
        id: placeId,
      });
      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async editPlace(
    placeId: string,
    editPlaceInput: EditPlaceInput,
    coverImage: Express.Multer.File,
  ): Promise<CoreOutput> {
    const { editedPlace, editedPlaceDetail } = editPlaceInput;
    try {
      await this.GetPlaceByIdAndcheckPlaceException(placeId);

      if (coverImage) {
        const s3_url = await this.s3Service.uploadToS3(coverImage, placeId);
        await this.placeRepository.updatePlace(
          {
            id: placeId,
          },
          {
            coverImage: s3_url,
          },
        );
      }

      if (_.isEqual(editPlaceInput, {})) {
        return {
          ok: true,
        };
      }

      await getManager().transaction(async (transactionalEntityManager) => {
        // Edit place
        await transactionalEntityManager.update(
          Place,
          {
            id: placeId,
          },
          {
            ...editedPlace,
          },
        );
        // Edit place detail
        await transactionalEntityManager.update(
          PlaceDetail,
          {
            place_id: placeId,
          },
          {
            ...editedPlaceDetail,
          },
        );
      });

      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async editPlaceReviewImages(
    placeId: string,
    reviewId: string,
    reviewImageFiles: Express.Multer.File[],
    editPlaceReviewImagesInput: EditPlaceReviewImagesInput,
  ): Promise<CoreOutput> {
    try {
      const placeExist = await this.placeRepository.findOneByPlaceId(placeId);
      const reviewExist = await this.reviewRepository.findReviewById(reviewId);

      if (!placeExist || !reviewExist) {
        throw new HttpException(
          '존재하지 않는 장소 및 리뷰입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      let updatedReviewImageUrls: string[] = [];
      for (let reviewImageFile of reviewImageFiles) {
        const s3_url = await this.s3Service.uploadToS3(
          reviewImageFile,
          placeId,
        );
        updatedReviewImageUrls.push(s3_url);
      }

      // Update review
      await this.reviewRepository.updateReview(reviewId, {
        imageUrls: updatedReviewImageUrls,
        description: editPlaceReviewImagesInput.description,
      });

      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getPlaceParticipantList(
    placeId: string,
  ): Promise<GetPlaceParticipantListOutput> {
    try {
      await this.GetPlaceByIdAndcheckPlaceException(placeId);

      // 참가자들 간략한 프로필 정보
      const participantListProfiles: PlaceDataParticipantsProfile[] =
        await this.reservationRepository.getParticipantsProfile(placeId);

      // 참여자 성비, 평균 나이 추가
      let total_count = participantListProfiles.length;
      let male_count = 0;
      let sum_age = 0;
      participantListProfiles.map((participant) => {
        if (participant.gender === 'Male') male_count++;
        sum_age += participant.age;
      });

      const participantsInfo = {
        total_count,
        male_count,
        average_age: Math.floor(sum_age / total_count) || 0,
      };

      return {
        ok: true,
        participants: {
          participantListProfiles,
          participantsInfo,
        },
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
