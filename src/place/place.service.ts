import { ReservationService } from './../reservation/reservation.service';
import {
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
import { GetPlacesByLocationOutput } from './dtos/get-place-by-Location.dto';
import { Place } from './entities/place.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import {
  GetPlaceByIdOutput,
  PlaceDetailData,
} from './dtos/get-place-by-id.dto';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    @InjectRepository(PlaceDetail)
    private placeDetailRepository: Repository<PlaceDetail>,
    private s3Service: S3Service,
    private placeUtilService: PlaceUtilService,
    private reservationService: ReservationService,
  ) {}

  async getPlacesByLocation(
    authUser: User,
    location: string,
    page: number,
  ): Promise<GetPlacesByLocationOutput> {
    try {
      const places = await this.placeRepository.find({
        where: {
          location: location,
          isClosed: false,
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
          'participantsCount',
        ],
        loadEagerRelations: false,
        take: 10,
        skip: 10 * (page - 1),
      });

      let mainFeedPlaces: MainFeedPlace[] = [];
      // Start to adjust output with place entity
      for (const place of places) {
        const isParticipating = await this.reservationService.isParticipating(
          authUser.id,
          place.id,
        );
        const participants: MainFeedPlaceParticipantsProfile[] =
          await this.reservationService.getParticipantsProfile(place.id);
        const deadline = this.placeUtilService.getDeadlineCaption(
          place.startDateAt,
        );
        const startDateFromNow = this.placeUtilService.getEventDateCaption(
          place.startDateAt,
        );
        console.log(deadline);
        mainFeedPlaces.push({
          ...place,
          deadline,
          startDateFromNow,
          participants,
          isParticipating,
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

  async getPlaceById(placeId: string): Promise<GetPlaceByIdOutput> {
    try {
      const placeDetail = await this.placeDetailRepository.findOne({
        where: {
          place_id: placeId,
        },
        select: [
          'categories',
          'title',
          'description',
          'photos',
          'detailAddress',
        ],
      });
      if (!placeDetail) {
        return {
          ok: false,
          error: '모임의 세부 정보가 존재하지 않습니다.',
        };
      }
      //   참여자 성비, 평균 나이 추가
      const partiProfile = await this.reservationService.getParticipantsProfile(
        placeId,
      );

      let total_count = partiProfile.length;
      let male_count = 0;
      let sum_age = 0;
      partiProfile.map((parti) => {
        if (parti.gender === 'Male') male_count++;
        sum_age += parti.age;
      });

      const placeDetailData: PlaceDetailData = {
        ...placeDetail,
        participants: {
          total_count,
          male_count,
          average_age: sum_age / total_count || 0,
        },
        isParticipating: false,
      };
      console.log(placeDetailData);
      return {
        ok: true,
        placeDetailData,
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
