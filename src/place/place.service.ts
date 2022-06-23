import { NotificationService } from 'notification/notification.service';
import { SearchPlaceInput, SearchPlaceOutput } from './dtos/search-place.dto';
import * as _ from 'lodash';
import { getManager, Raw } from 'typeorm';
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
import { EditPlaceInput, EditPlacePhotoInput } from './dtos/edit-place.dto';
import { DeletePlaceOutput } from './dtos/delete-place.dto';
import { GetPlacesOutput } from './dtos/get-places.dto';
import { DeadlineIndicator, Place, PlaceType } from './entities/place.entity';
import { GetPlaceParticipantListOutput } from './dtos/get-place-participant-list.dto';
import { PlaceDetail } from './entities/place-detail.entity';
import { Gender } from '@user/entities/user-profile.entity';
import * as moment from 'moment';

@Injectable()
export class PlaceService {
  constructor(
    private reservationRepository: ReservationRepository,
    private placeRepository: PlaceRepository,
    private placeDetailRepository: PlaceDetailRepository,
    private s3Service: S3Service,
    private notificationService: NotificationService,
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
      const today = new Date();
      const whereOptions: GetPlacesWhereOptions =
        this.filterDefaultWhereOptions(location, placeType);
      const openPlaces = await this.placeRepository.findManyPlaces({
        where: {
          ...whereOptions,
          isClosed: false,
        },
        order: {
          startDateAt: 'ASC',
        },
        loadEagerRelations: true,
        // take: limit,
        // skip: limit * (page - 1),
      });
      const closedPlaces = await this.placeRepository.findManyPlaces({
        where: {
          ...whereOptions,
          isClosed: true,
        },
        order: {
          startDateAt: 'DESC',
        },
        loadEagerRelations: true,
        // take: limit,
        // skip: limit * (page - 1),
      });

      const openMyPlaceASC = _.filter(
        openPlaces,
        (place) => place.team === team,
      );
      const closedMyPlaceDESC = _.filter(
        closedPlaces,
        (place) =>
          place.team === team && (place.isAfterToday() || place.isToday()),
      );

      const closeNotMyTeamPlaceDESC = _.difference(
        closedPlaces,
        closedMyPlaceDESC,
      );
      let seperator1 = false;
      let seperator2 = false;

      const openNotMyTeamPlaceASC = _.filter(
        openPlaces,
        (places) => places.team !== team,
      );
      openMyPlaceASC.push(
        ...closedMyPlaceDESC,
        ...openNotMyTeamPlaceASC,
        ...closeNotMyTeamPlaceDESC,
      );

      // openPlaceOrderByStartDateAtASC.push(...closedPlaceOrderByStartDateAtDESC);

      if (page === 1 && openMyPlaceASC) seperator1 = true;

      if (page === 1 && (openMyPlaceASC || closedMyPlaceDESC))
        seperator2 = true;

      const finalPlaceEntities = openMyPlaceASC.slice(
        limit * (page - 1),
        limit * page,
      );

      let mainFeedPlaces: MainFeedPlace[] = [];
      // Start to adjust output with place entity
      for (const place of finalPlaceEntities) {
        const startDateFromNow = place.getStartDateFromNow();
        const deadline = place.getDeadlineCaption(today);

        const myTeam = place.team === team;
        const seperatorMyTeam = seperator1 && myTeam;
        const seperatorNotMyTeam = seperator2 && !myTeam;

        if (seperatorMyTeam && seperator1) seperator1 = false;
        if (seperatorNotMyTeam && seperator2) seperator2 = false;

        // Regarding to Participants
        const participants: MainFeedPlaceParticipantsProfile[] =
          await this.reservationRepository.getParticipantsProfile(place.id);
        const participantsCount: number = participants.length;
        const leftParticipantsCount: number =
          place.placeDetail.maxParticipantsNumber - participantsCount;

        // isClosed Update 로직 (참가자 수가 최대 인원일 때, 3시간 전)
        if (
          deadline === DeadlineIndicator.Done ||
          startDateFromNow === '마감' ||
          participantsCount === place.placeDetail.maxParticipantsNumber
        ) {
          if (!place.isClosed) {
            place.isClosed = true;
            await this.placeRepository.savePlace(place);
          }
        } else if (place.isClosed) {
          place.isClosed = false;
          await this.placeRepository.savePlace(place);
        }
        mainFeedPlaces.push({
          ...place,
          startDateFromNow,
          deadline,
          participants,
          participantsCount,
          leftParticipantsCount,
          myTeam,
          seperatorMyTeam,
          seperatorNotMyTeam,
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

      let maleCount = 0;
      let femaleCount = 0;
      for (const participant of participants) {
        if (participant.gender === Gender.Male) {
          maleCount++;
        } else {
          femaleCount++;
        }
      }

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
          maleCount,
          femaleCount,
        },
      };
      return {
        ok: true,
        placeData,
      };
    } catch (error) {
      return { ok: false, error };
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
        placeType,
        kakaoLink,
        team,
        notParticipating,
        recommendation,
        qAndA,
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

      const qAndAs: string[] = [];
      if (qAndA) {
        for (const qa of qAndA) {
          qAndAs.push(qa);
        }
        qAndAs.pop();
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
            recommendation,
            creator: authUser,
            qAndA: qAndAs,
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
        if (!notParticipating) {
          const time = moment(startDateAt).subtract(5, 'h').toDate();
          const payload = {
            notification: {
              title: name,
              body: '모임 시작까지 5시간전!',
              sound: 'default',
            },
            data: {
              type: 'place',
              sentAt: new Date().toString(),
              content: '테스트',
            },
          };

          await this.notificationService.sendNotifications(
            authUser.firebaseToken,
            payload,
            { cronInput: { time, name: 'reservation' } },
          );
          // Make reservation
          const reservation = this.reservationRepository.create({
            place_id: place.id,
            user_id: authUser.id,
            isCanceled: false,
          });
          await transactionalEntityManager.save(reservation);
        }
      });

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  public async deletePlace(
    authUser: User,
    placeId: string,
  ): Promise<DeletePlaceOutput> {
    try {
      await this.GetPlaceByIdAndcheckPlaceException(placeId);
      const place = await this.placeRepository.findOneByPlaceId(placeId);

      if (authUser.id !== place.creator_id) {
        return { ok: false, error: '모임 생성자가 아닙니다' };
      }

      await this.placeRepository.delete({
        id: placeId,
      });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  public async editPlace(
    authUser: User,
    placeId: string,
    editPlaceInput: EditPlaceInput,
    placePhotoInput: EditPlacePhotoInput,
  ): Promise<CoreOutput> {
    const {
      placeId: kakaoPlaceId,
      name,
      description,
      maxParticipantsNumber,
      startDateAt,
      participationFee,
      detailAddress,
      placeType,
      kakaoLink,
      team,
      isCoverImageDeleted,
      recommendation,
      oldSubImageUrls,
      oldCoverImageUrl,
      qAndA,
    } = editPlaceInput;

    try {
      await this.GetPlaceByIdAndcheckPlaceException(placeId);

      let newSubImageUrls: string[] = !oldSubImageUrls
        ? []
        : typeof oldSubImageUrls === 'string'
        ? [oldSubImageUrls]
        : [...oldSubImageUrls];
      let newCoverImage;

      if (placePhotoInput) {
        const { images } = placePhotoInput;
        if (images) {
          for (const image of images) {
            const s3_url = await this.s3Service.uploadToS3(image, authUser.id);
            newSubImageUrls.push(s3_url);
          }
        }
      }

      if (oldCoverImageUrl) {
        newCoverImage = oldCoverImageUrl;
      } else {
        newCoverImage = newSubImageUrls.shift();
      }

      await getManager().transaction(async (transactionalEntityManager) => {
        // Edit place
        await transactionalEntityManager.update(
          Place,
          {
            id: placeId,
          },
          {
            kakaoPlaceId: kakaoPlaceId,
            placeType,
            name,
            startDateAt,
            team,
            recommendation,
            coverImage: newCoverImage,
            subImages: newSubImageUrls,
            qAndA,
          },
        );
        // Edit place detail
        await transactionalEntityManager.update(
          PlaceDetail,
          {
            place_id: placeId,
          },
          {
            participationFee: +participationFee,
            description,
            maxParticipantsNumber,
            detailAddress,
            kakaoLink,
          },
        );
      });

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
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
    } catch (error) {
      return { ok: false, error };
    }
  }

  async searchPlaceByName({
    query,
    page,
  }: SearchPlaceInput): Promise<SearchPlaceOutput> {
    try {
      const [places, totalResults] = await this.placeRepository.findAndCount({
        where: [
          {
            name: Raw((name) => `${name} ILIKE '%${query}%'`),
          },
          {
            recommendation: Raw(
              (recommendation) => `${recommendation} ILIKE '%${query}%'`,
            ),
          },
        ],
        skip: (page - 1) * 5,
        take: 5,
      });
      return {
        ok: true,
        places,
        totalResults,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch {
      return { ok: false, error: 'Could not search for places' };
    }
  }
}
