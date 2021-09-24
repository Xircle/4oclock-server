import { ReservationUtilService } from './../utils/reservation/reservation-util.service';
import {
  GetPlaceByLocationWhereOptions,
  MainFeedPlace,
  MainFeedPlaceParticipantsProfile,
} from './dtos/get-place-by-location.dto';
import { PlaceUtilService } from './../utils/place/place-util.service';
import { PlaceDetail } from './entities/place-detail.entity';
import { User } from './../user/entities/user.entity';
import { DeletePlaceOutput } from './dtos/delete-place.dto';
import { S3Service } from 'src/aws/s3/s3.service';
import {
  CreatePlaceInput,
  CreatePlaceOutput,
  PlacePhotoInput,
} from './dtos/create-place.dto';
import { GetPlacesByLocationOutput } from './dtos/get-place-by-location.dto';
import { Place } from './entities/place.entity';
import {
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import {
  GetPlaceByIdOutput,
  PlaceData,
  PlaceDataParticipantsProfile,
} from './dtos/get-place-by-id.dto';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Injectable({ scope: Scope.REQUEST })
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    @InjectRepository(PlaceDetail)
    private placeDetailRepository: Repository<PlaceDetail>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
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
      const places = await this.placeRepository.find({
        where: {
          ...whereOptions,
        },
        order: {
          startDateAt: 'ASC',
        },
        select: [
          'id',
          'name',
          'coverImage',
          'tags',
          'recommendation',
          'startDateAt',
          'isClosed',
        ],
        loadEagerRelations: false,
        take: 10,
        skip: 10 * (page - 1),
      });

      let mainFeedPlaces: MainFeedPlace[] = [];
      // Start to adjust output with place entity
      for (const place of places) {
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
            },
          });
        const participants: MainFeedPlaceParticipantsProfile[] =
          await this.reservationUtilService.getParticipantsProfile(place.id);
        const deadline = this.placeUtilService.getDeadlineCaption(
          place.startDateAt,
        );
        const startDateFromNow = this.placeUtilService.getEventDateCaption(
          place.startDateAt,
        );
        if (deadline === '마감') {
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

      //   places startDateAt을 기준으로 place-util로 커스텀해서 바꾼후에 보내주기.
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
        select: [
          'id',
          'name',
          'coverImage',
          'recommendation',
          'startDateAt',
          'isClosed',
        ],
      });

      if (!place) {
        return {
          ok: false,
          error: '모임이 존재하지 않습니다.',
        };
      }

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
      name,
      location,
      tags,
      recommendation,
      startDateAt,
      title,
      description,
      categories,
      detailAddress,
    } = createPlaceInput;
    const { coverImage, reviewImages } = placePhotoInput;

    try {
      // Upload to S3
      const coverImageS3Url = await this.s3Service.uploadToS3(
        coverImage[0],
        authUser.id,
      );
      const photoImagesUrl: string[] = [];
      for (const reviewImage of reviewImages) {
        const s3_url = await this.s3Service.uploadToS3(
          reviewImage,
          authUser.id,
        );
        photoImagesUrl.push(s3_url);
      }

      //   Transction start
      await getManager().transaction(async (transactionalEntityManager) => {
        //   Create place
        const place = this.placeRepository.create({
          name,
          coverImage: coverImageS3Url,
          location,
          tags,
          recommendation,
          startDateAt,
        });
        await transactionalEntityManager.save(place);

        //   Create place detail
        const placeDetail = this.placeDetailRepository.create({
          title,
          description,
          categories,
          photos: photoImagesUrl,
          place,
          detailAddress: detailAddress,
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
}
