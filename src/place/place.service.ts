import { EditPlaceReviewImagesInput } from './dtos/edit-place-review-image.dto';
import { EditPlaceInput } from './dtos/edit-place.dto';
import { ReservationUtilService } from './../utils/reservation/reservation-util.service';
import {
  GetPlaceByLocationWhereOptions,
  MainFeedPlace,
  MainFeedPlaceParticipantsProfile,
} from './dtos/get-place-by-location.dto';
import {
  CreatePlaceInput,
  CreatePlaceOutput,
  PlacePhotoInput,
} from './dtos/create-place.dto';
import { PlaceDetail } from './entities/place-detail.entity';
import { User } from './../user/entities/user.entity';
import { DeletePlaceOutput } from './dtos/delete-place.dto';
import { S3Service } from 'src/aws/s3/s3.service';
import { GetPlacesByLocationOutput } from './dtos/get-place-by-location.dto';
import { Place } from './entities/place.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import {
  GetPlaceByIdOutput,
  PlaceData,
  PlaceDataParticipantsProfile,
} from './dtos/get-place-by-id.dto';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { GetPlaceParticipantListOutput } from './dtos/get-place-participant-list.dto';
import { CoreOutput } from 'src/common/common.interface';
import * as _ from 'lodash';
import { EventService } from 'src/event/event.service';
import { EventName } from 'src/event/entities/event-banner.entity';
import { PlaceRepository } from './repository/place.repository';
import { ReviewRepository } from 'src/review/repository/review.repository';
import { PlaceDetailRepository } from './repository/place-detail.repository';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private placeRepository: PlaceRepository,
    private placeDetailRepository: PlaceDetailRepository,
    private reviewRepository: ReviewRepository,
    private s3Service: S3Service,
    private reservationUtilService: ReservationUtilService,
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
    anyUser: User | undefined,
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
      // 번개는 '열려있는' '최신순으로' 모임 3개만 가져오기
      let lightningPlace: Place[] = [];
      if (page === 1) {
        lightningPlace = await this.placeRepository.findManyPlaces({
          where: {
            isLightning: true,
            isClosed: false,
          },
          order: {
            startDateAt: 'ASC',
          },
          take: 3,
          loadEagerRelations: false,
        });
      }

      const normalPlaces = await this.placeRepository.findManyPlaces({
        where: {
          ...whereOptions,
          isLightning: false,
        },
        order: {
          startDateAt: 'DESC',
        },
        loadEagerRelations: false,
        take: limit,
        skip: limit * (page - 1),
      });

      const openPlaceOrderByStartDateAtDESC = _.takeWhile(
        normalPlaces,
        (place) => !place.isClosed,
      );
      const closedPlaceOrderByStartDateAtDESC = _.difference(
        normalPlaces,
        openPlaceOrderByStartDateAtDESC,
      );
      const openPlaceOrderByStartDateAtASC =
        openPlaceOrderByStartDateAtDESC.reverse();

      const openPlaceOrderByStartDateAtASCWithLightning: Place[] = [
        ...lightningPlace,
        ...openPlaceOrderByStartDateAtASC,
      ];
      openPlaceOrderByStartDateAtASCWithLightning.push(
        ...closedPlaceOrderByStartDateAtDESC,
      );
      const finalPlaceEntities = openPlaceOrderByStartDateAtASCWithLightning;

      let mainFeedPlaces: MainFeedPlace[] = [];
      // Start to adjust output with place entity
      for (const place of finalPlaceEntities) {
        let isParticipating = false;
        if (anyUser) {
          // AuthUser 일 때만, 익명 유저도 볼 수 있기 때문에
          isParticipating = await this.reservationUtilService.isParticipating(
            anyUser.id,
            place.id,
          );
        }
        const participantsCount: number =
          await this.reservationRepository.count({
            where: {
              place_id: place.id,
              isCanceled: false,
            },
          });

        const participants: MainFeedPlaceParticipantsProfile[] =
          await this.reservationUtilService.getParticipantsProfile(place.id);

        const deadline = place.getDeadlineCaption();
        // isClosed Update 로직
        if (place.isLightning) {
          if (deadline === '번개 마감' && !place.isClosed) {
            place.isClosed = true;
            await this.placeRepository.savePlace(place);
          }
        } else {
          if (deadline === '마감' && !place.isClosed) {
            place.isClosed = true;
            await this.placeRepository.savePlace(place);
          }
        }
        const startDateFromNow = place.getStartDateFromNow();
        mainFeedPlaces.push({
          ...place,
          isParticipating,
          participantsCount,
          participants,
          deadline,
          startDateFromNow,
        });
      }

      // event banner
      const eventBannerImageUrl = await this.eventService.getRandomEventBanner(
        EventName.Halloween,
      );

      return {
        ok: true,
        places: mainFeedPlaces,
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

      // 조회수 업데이트
      await this.placeRepository.updatePlace(
        {
          id: placeId,
        },
        {
          views: place.views + 1,
        },
      );

      // 참여 여부
      let isParticipating = false;
      if (anyUser) {
        isParticipating = await this.reservationUtilService.isParticipating(
          anyUser.id,
          placeId,
        );
      }
      const participantsCount = await this.reservationRepository.count({
        where: {
          place_id: place.id,
          isCanceled: false,
        },
      });

      // 참여자 성비, 평균 나이 추가
      const participants: PlaceDataParticipantsProfile[] =
        await this.reservationUtilService.getParticipantsProfile(placeId);

      let total_count = participants.length;
      let male_count = 0;
      let sum_age = 0;
      participants.map((participant) => {
        if (participant.gender === 'Male') male_count++;
        sum_age += participant.age;
      });

      const participantsInfo = {
        total_count,
        male_count,
        average_age: Math.floor(sum_age / total_count) || 0,
      };

      // 이벤트 시작 시간
      const startDateFromNow = place.getStartDateFromNow();
      const placeData: PlaceData = {
        ...place,
        reviews: place.reviews,
        isParticipating,
        participantsCount,
        startDateFromNow,
        participants,
        participantsInfo,
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
      isLightning,
      maxParticipantsNumber,
      name,
      location,
      recommendation,
      startDateAt,
      startTime,
      title,
      oneLineIntroText,
      participationFee,
      description,
      categories,
      detailAddress,
      detailLink,
      reviewDescription,
    } = createPlaceInput;
    const { coverImage, reviewImages } = placePhotoInput;
    try {
      // Upload to S3 (url 생성)
      const coverImageS3Url = await this.s3Service.uploadToS3(
        coverImage[0],
        authUser.id,
      );
      const reviewImagesS3Url: string[] = [];
      for (const reviewImage of reviewImages) {
        const s3_url = await this.s3Service.uploadToS3(
          reviewImage,
          authUser.id,
        );
        reviewImagesS3Url.push(s3_url);
      }
      //   Transction start
      await getManager().transaction(async (transactionalEntityManager) => {
        //   Create place
        const place = await this.placeRepository.createAndSavePlace(
          {
            isLightning,
            name,
            coverImage: coverImageS3Url,
            location,
            recommendation,
            oneLineIntroText,
            startDateAt,
            startTime,
          },
          transactionalEntityManager,
        );
        //  Create review (사진이 여러개인 리뷰 하나)
        await this.reviewRepository.createAndSaveReview(
          {
            imageUrls: reviewImagesS3Url,
            description: reviewDescription,
            isRepresentative: true,
            place,
            user: authUser,
          },
          transactionalEntityManager,
        );
        //   Create place detail
        await this.placeDetailRepository.createAndSavePlaceDetail(
          {
            title,
            description,
            maxParticipantsNumber,
            categories: JSON.stringify(categories),
            place,
            participationFee: +participationFee,
            detailAddress,
            detailLink,
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
  ): Promise<CoreOutput> {
    const { editedPlace, editedPlaceDetail } = editPlaceInput;
    try {
      await this.GetPlaceByIdAndcheckPlaceException(placeId);

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
        await this.reservationUtilService.getParticipantsProfile(placeId);

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
