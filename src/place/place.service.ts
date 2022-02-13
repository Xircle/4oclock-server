import * as _ from 'lodash';
import { getManager } from 'typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ReservationRepository } from '@reservation/repository/reservation.repository';
import { S3Service } from '@aws/s3/s3.service';
import { User } from '@user/entities/user.entity';
import { CoreOutput } from '@common/common.interface';
import {
  GetPlaceByIdOutput,
  PlaceData,
  PlaceDataParticipantsProfile,
} from './dtos/get-place-by-id.dto';
import {
  GetPlacesQueryParameter,
  GetPlacesWhereOptions,
  MainFeedPlace,
  MainFeedPlaceParticipantsProfile,
} from './dtos/get-places.dto';
import {
  CreatePlaceInput,
  CreatePlaceOutput,
  PlacePhotoInput,
} from './dtos/create-place.dto';
import { PlaceRepository } from './repository/place.repository';
import { PlaceDetailRepository } from './repository/place-detail.repository';
import { EditPlaceInput } from './dtos/edit-place.dto';
import { DeletePlaceOutput } from './dtos/delete-place.dto';
import { GetPlacesOutput } from './dtos/get-places.dto';
import { DeadlineIndicator, Place, PlaceType } from './entities/place.entity';
import { GetPlaceParticipantListOutput } from './dtos/get-place-participant-list.dto';
import { PlaceDetail } from './entities/place-detail.entity';

@Injectable()
export class PlaceService {
  constructor(
    private reservationRepository: ReservationRepository,
    private placeRepository: PlaceRepository,
    private placeDetailRepository: PlaceDetailRepository,
    private s3Service: S3Service,
  ) {}

  private checkPlaceException(entity: Place): void {
    if (!entity) {
      throw new HttpException(
        '존재하지 않는 장소입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async GetPlaceByIdAndcheckPlaceException(placeId: string) {
    const place = await this.placeRepository.findOneByPlaceId(placeId);
    this.checkPlaceException(place);
    return place;
  }

  private filterDefaultWhereOptions(
    location?: string,
    placeType?: PlaceType,
  ): GetPlacesWhereOptions {
    let whereOptions: GetPlacesWhereOptions = {};
    if (location && location !== '전체') {
      whereOptions = {
        ...whereOptions,
        location,
      };
    }
    if (placeType && placeType !== PlaceType.All) {
      whereOptions = {
        ...whereOptions,
        placeType,
      };
    }
    return whereOptions;
  }

  public async getPlaces(
    { location, placeType, team }: GetPlacesQueryParameter = {},
    page: number,
    limit: number,
  ): Promise<GetPlacesOutput> {
    try {
      const whereOptions: GetPlacesWhereOptions =
        this.filterDefaultWhereOptions(location, placeType);

      const places = await this.placeRepository.findManyPlaces({
        where: {
          ...whereOptions,
        },
        order: {
          startDateAt: 'DESC',
        },
        loadEagerRelations: true,
        // take: limit,
        // skip: limit * (page - 1),
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

      const openMyPlaceASC = _.filter(
        openPlaceOrderByStartDateAtASC,
        (place) => place.team === team,
      );

      const openNotMyTeamPlaceASC = _.filter(
        openPlaceOrderByStartDateAtASC,
        (places) => places.team !== team,
      );
      openMyPlaceASC.push(
        ...openNotMyTeamPlaceASC,
        ...closedPlaceOrderByStartDateAtDESC,
      );

      // openPlaceOrderByStartDateAtASC.push(...closedPlaceOrderByStartDateAtDESC);

      const finalPlaceEntities = openMyPlaceASC.slice(
        limit * (page - 1),
        limit * (page - 1) + limit - 1,
      );

      let mainFeedPlaces: MainFeedPlace[] = [];
      // Start to adjust output with place entity
      for (const place of finalPlaceEntities) {
        const startDateFromNow = place.getStartDateFromNow();
        const deadline = place.getDeadlineCaption();
        const myTeam = place.team === team;
        // Regarding to Participants
        const participants: MainFeedPlaceParticipantsProfile[] =
          await this.reservationRepository.getParticipantsProfile(place.id);
        const participantsCount: number = participants.length;
        const leftParticipantsCount: number =
          place.placeDetail.maxParticipantsNumber - participantsCount;

        // isClosed Update 로직 (참가자 수가 최대 인원일 때, 3시간 전)
        if (!place.isClosed) {
          if (
            deadline === DeadlineIndicator.Done ||
            participantsCount === place.placeDetail.maxParticipantsNumber
          ) {
            place.isClosed = true;
            await this.placeRepository.savePlace(place);
          }
        }
        mainFeedPlaces.push({
          ...place,
          startDateFromNow,
          deadline,
          participants,
          participantsCount,
          leftParticipantsCount,
          myTeam,
        });
      }

      // Make place Metadata
      const placeMetadata = await this.placeRepository.getPlaceMetaData(
        page,
        limit,
      );
      return {
        ok: true,
        places: mainFeedPlaces,
        meta: placeMetadata,
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  public async getPlaceById(
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

      const participants: PlaceDataParticipantsProfile[] =
        await this.reservationRepository.getParticipantsProfile(placeId);

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
        startDateFromNow,
        isParticipating,
        participants,
        participantsData: {
          participantsCount,
          leftParticipantsCount,
        },
      };
      return {
        ok: true,
        placeData,
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  public async createPlace(
    authUser: User,
    createPlaceInput: CreatePlaceInput,
    placePhotoInput: PlacePhotoInput,
  ): Promise<CreatePlaceOutput> {
    try {
      const {
        placeId,
        name,
        description,
        maxParticipantsNumber,
        startDateAt,
        participationFee,
        detailAddress,
        isVaccinated,
        placeType,
        kakaoLink,
        team,
      } = createPlaceInput;
      const { coverImage, subImages } = placePhotoInput;
      // Upload coverImage, subImages to S3 (url 생성)
      const coverImageS3Url = await this.s3Service.uploadToS3(
        coverImage[0],
        authUser.id,
      );
      const subImageS3Urls: string[] = [];
      if (subImages)
        for (const subImage of subImages) {
          const s3_url = await this.s3Service.uploadToS3(subImage, authUser.id);
          subImageS3Urls.push(s3_url);
        }

      //   Transction start
      await getManager().transaction(async (transactionalEntityManager) => {
        //   Create place
        const place = await this.placeRepository.createAndSavePlace(
          {
            kakaoPlaceId: placeId,
            coverImage: coverImageS3Url,
            subImages: subImageS3Urls,
            placeType,
            name,
            startDateAt,
            team,
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
            kakaoLink,
          },
          transactionalEntityManager,
        );
        if (placeType === PlaceType.Lightning) {
          // Make reservation
          const reservation = this.reservationRepository.create({
            place_id: place.id,
            user_id: authUser.id,
            isCanceled: false,
            isVaccinated,
          });
          await transactionalEntityManager.save(reservation);
        }
      });

      return {
        ok: true,
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  public async deletePlace(placeId: string): Promise<DeletePlaceOutput> {
    try {
      await this.GetPlaceByIdAndcheckPlaceException(placeId);

      await this.placeRepository.delete({
        id: placeId,
      });
      return {
        ok: true,
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  public async editPlace(
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
      throw new InternalServerErrorException();
    }
  }

  public async getPlaceParticipantList(
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
      throw new InternalServerErrorException();
    }
  }
}
