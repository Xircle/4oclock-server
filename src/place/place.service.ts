import { ReviewPayload } from './dtos/edit-place-review-image.dto';
import { Review } from 'src/review/entities/review.entity';
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
import { PlaceUtilService } from './../utils/place/place-util.service';
import { PlaceDetail } from './entities/place-detail.entity';
import { User } from './../user/entities/user.entity';
import { DeletePlaceOutput } from './dtos/delete-place.dto';
import { S3Service } from 'src/aws/s3/s3.service';
import { GetPlacesByLocationOutput } from './dtos/get-place-by-location.dto';
import { Place } from './entities/place.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    @InjectRepository(PlaceDetail)
    private placeDetailRepository: Repository<PlaceDetail>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private placeUtilService: PlaceUtilService,
    private s3Service: S3Service,
    private reservationUtilService: ReservationUtilService,
  ) {}

  async getPlacesByLocation(
    anyUser: User | undefined,
    location: string,
    page: number,
  ): Promise<GetPlacesByLocationOutput> {
    let whereOptions: GetPlaceByLocationWhereOptions = {};
    if (location !== '전체') {
      whereOptions = {
        location,
      };
    }
    try {
      let lightningPlace = await this.placeRepository.find({
        where: {
          isLightning: true,
          isClosed: false,
        },
        select: [
          'id',
          'isLightning',
          'name',
          'coverImage',
          'startDateAt',
          'startTime',
          'isClosed',
          'oneLineIntroText',
          'views',
        ],
        take: 3,
        loadEagerRelations: false,
      });
      let normalPlaces = await this.placeRepository.find({
        where: {
          ...whereOptions,
          isLightning: false,
        },
        order: {
          startDateAt: 'ASC',
        },
        select: [
          'id',
          'isLightning',
          'name',
          'coverImage',
          'startDateAt',
          'startTime',
          'isClosed',
          'oneLineIntroText',
          'views',
        ],
        loadEagerRelations: false,
        take: 15,
        skip: 10 * (page - 1),
      });
      const closedPlace = _.takeWhile(
        normalPlaces,
        (place) => place.isClosed,
      ).reverse();
      const openPlace = _.difference(normalPlaces, closedPlace);
      const openPlaceWithLightning: Place[] = [...lightningPlace, ...openPlace];
      openPlaceWithLightning.push(...closedPlace);
      normalPlaces = openPlaceWithLightning;

      let mainFeedPlaces: MainFeedPlace[] = [];
      // Start to adjust output with place entity
      for (const place of normalPlaces) {
        let isParticipating = false;
        if (anyUser) {
          // AuthUser 일 때만
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
        let deadline = this.placeUtilService.getDeadlineCaption(
          place.startDateAt,
        );
        if (place.isLightning) {
          deadline = '번개';
        }
        const startDateFromNow = this.placeUtilService.getEventDateCaption(
          place.startDateAt,
        );
        if (!place.isLightning && deadline === '마감') {
          place.isClosed = true;
          await this.placeRepository.save(place);
        }
        mainFeedPlaces.push({
          ...place,
          isParticipating,
          participantsCount,
          participants,
          deadline,
          startDateFromNow,
        });
      }

      return {
        ok: true,
        places: mainFeedPlaces,
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
      const place = await this.placeRepository.findOne({
        where: {
          id: placeId,
        },
        relations: ['reviews'],
        select: [
          'id',
          'name',
          'coverImage',
          'isLightning',
          'location',
          'recommendation',
          'oneLineIntroText',
          'startDateAt',
          'startTime',
          'isClosed',
          'isLightning',
          'views',
          'reviews',
        ],
      });
      if (!place) {
        return {
          ok: false,
          error: '모임이 존재하지 않습니다.',
        };
      }
      // 조회수 업데이트
      await this.placeRepository.update(
        {
          id: placeId,
        },
        {
          views: place.views + 1,
        },
      );

      // 이벤트 시작 시간
      const startDateFromNow = this.placeUtilService.getEventDateCaption(
        place.startDateAt,
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
      reviewDescriptions,
    } = createPlaceInput;
    const { coverImage, reviewImages } = placePhotoInput;

    try {
      // Upload to S3 (url 생성)
      if (!coverImage || !reviewImages)
        return {
          ok: false,
          error: '대표 이미지, 매장 이미지를 업로드 해주세요.',
        };
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
        const place = this.placeRepository.create({
          isLightning,
          name,
          coverImage: coverImageS3Url,
          location,
          recommendation,
          oneLineIntroText,
          startDateAt,
          startTime,
        });
        await transactionalEntityManager.save(place);

        //  Create reviews
        let reviews: Review[] = [];
        for (let [index, reviewImageUrl] of reviewImagesS3Url.entries()) {
          const review = this.reviewRepository.create({
            imageUrl: reviewImageUrl,
            description: reviewDescriptions[index],
            place,
            user: authUser,
          });
          reviews.push(review);
        }
        await transactionalEntityManager.save(reviews);

        //   Create place detail
        const placeDetail = this.placeDetailRepository.create({
          title,
          description,
          maxParticipantsNumber,
          categories: JSON.stringify(categories),
          place,
          participationFee: +participationFee,
          detailAddress,
          detailLink,
        });
        await transactionalEntityManager.save(placeDetail);
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
      const exists = await this.placeRepository.findOne({
        id: placeId,
      });
      if (!exists) {
        return {
          ok: false,
          error: '존재하지 않는 공간입니다.',
        };
      }

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
      const exists = await this.placeRepository.findOne({
        where: {
          id: placeId,
        },
      });
      if (!exists) {
        return {
          ok: false,
          error: '존재하지 않는 장소입니다.',
        };
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
    reviewImages: Express.Multer.File[],
    reviewPayload: ReviewPayload[],
  ): Promise<CoreOutput> {
    try {
      const exist = await this.placeRepository.findOne({
        where: {
          id: placeId,
        },
      });
      if (!exist) {
        return {
          ok: false,
          error: '존재하지 않는 장소입니다.',
        };
      }

      // Transaction start
      await getManager().transaction(async (transactionalEntityManager) => {
        for (let [index, reviewImage] of reviewImages.entries()) {
          const s3_url = await this.s3Service.uploadToS3(reviewImage, placeId);
          await transactionalEntityManager.update(
            Review,
            {
              id: reviewPayload[index].id,
            },
            {
              imageUrl: s3_url,
              description: reviewPayload[index].description,
            },
          );
        }
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
      const exists = await this.placeRepository.find({
        where: {
          id: placeId,
        },
      });
      if (!exists) {
        return {
          ok: false,
          error: '존재하지 않는 장소입니다.',
        };
      }

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
