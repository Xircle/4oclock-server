import { NotificationService } from './../notification/notification.service';
import { CoreOutput } from '@common/common.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlaceService } from '@place/place.service';
import { DeleteReservationOutput } from '@user/dtos/delete-reservation.dto';
import { User } from '@user/entities/user.entity';
import { GetReservationParticipantNumberOutput } from './dtos/get-reservation-number.dto';
import {
  MakeReservationDto,
  MakeReservationOutput,
} from './dtos/make-reservation.dto';
import { PatchReservationInput } from './dtos/patch-reservation.dto';
import { ReservationRepository } from './repository/reservation.repository';
import * as moment from 'moment';

@Injectable()
export class ReservationService {
  constructor(
    private reservationRepository: ReservationRepository,
    private placeService: PlaceService,
    private notificationService: NotificationService,
  ) {}

  async makeReservation(
    authUser: User,
    makeReservation: MakeReservationDto,
  ): Promise<MakeReservationOutput> {
    const { placeId, qAndA } = makeReservation;
    try {
      const targetPlace =
        await this.placeService.GetPlaceByIdAndcheckPlaceException(placeId);

      if (targetPlace.isClosed) {
        return {
          ok: false,
          error: '이미 마감된 모임입니다.',
        };
      }
      const exists = await this.reservationRepository.findOne({
        where: {
          place_id: placeId,
          user_id: authUser.id,
        },
      });
      if (exists && !exists.isCanceled) {
        // 예약이 생성은 됐는데 취소를 한 적이 없으면, 예약이 중복된 상황
        return {
          ok: false,
          error: '이미 신청하셨습니다.',
        };
      }
      if (!exists) {
        // 유저가 최초에 예약할 때
        const reservation = this.reservationRepository.create({
          place_id: placeId,
          user_id: authUser.id,
          isCanceled: false,
          qAndA,
        });
        await this.reservationRepository.save(reservation);
      } else if (exists.isCanceled) {
        // 예약한 적이 있는데, 취소를 했었을 때
        await this.reservationRepository.update(
          {
            user_id: authUser.id,
            place_id: placeId,
          },
          {
            isCanceled: false,
            cancelReason: null,
            detailReason: null,
            qAndA,
          },
        );
      }

      const time = moment(targetPlace.startDateAt).subtract(5, 'h').toDate();
      const payload = {
        notification: {
          title: targetPlace.name,
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
        { cronInput: { time, name: `reservation ${targetPlace.id}` } },
      );
      return {
        ok: true,
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async getReservationParticipantNumber(
    placeId: string,
  ): Promise<GetReservationParticipantNumberOutput> {
    try {
      await this.placeService.GetPlaceByIdAndcheckPlaceException(placeId);
      this.notificationService.cancelNotifications(`reservation ${placeId}`);
      const number_reservations = await this.reservationRepository.count({
        where: {
          place_id: placeId,
          isCanceled: false,
        },
      });
      return {
        ok: true,
        participantsNumber: number_reservations,
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async patchReservation(
    authUser: User,
    placeId: string,
    patchReservationInput: PatchReservationInput,
  ): Promise<DeleteReservationOutput> {
    try {
      await this.placeService.GetPlaceByIdAndcheckPlaceException(placeId);

      // 예약 취소하고, 사유 업데이트 하기
      const { cancelReason, detailReason } = patchReservationInput;
      await this.reservationRepository.update(
        {
          place_id: placeId,
          user_id: authUser.id,
        },
        {
          isCanceled: true,
          cancelReason,
          detailReason,
        },
      );
      return {
        ok: true,
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async cancelReservationByCreator(
    authUser: User,
    placeId: string,
    participantId: string,
  ): Promise<CoreOutput> {
    try {
      const { creator_id } =
        await this.placeService.GetPlaceByIdAndcheckPlaceException(placeId);
      if (creator_id !== authUser.id) {
        return { ok: false, error: '모임 생성자가 아닙니다' };
      } else {
        this.notificationService.cancelNotifications(`reservation ${placeId}`);
        await this.reservationRepository.update(
          {
            place_id: placeId,
            user_id: participantId,
          },
          {
            isCanceled: true,
            cancelReason: '방장에 의한 강퇴',
            detailReason: '방장에 의한 강퇴',
          },
        );
        return {
          ok: true,
        };
      }
    } catch (error) {
      return { ok: false, error };
    }
  }
}
