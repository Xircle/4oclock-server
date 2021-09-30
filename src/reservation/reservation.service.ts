import { GetReservationParticipantNumberOutput } from './dtos/get-reservation-number.dto';
import { User } from './../user/entities/user.entity';
import { Place } from './../place/entities/place.entity';
import {
  MakeReservationDto,
  MakeReservationOutput,
} from './dtos/make-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reservation, StartTime } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { DeleteReservationOutput } from 'src/user/dtos/delete-reservation.dto';
import { PatchReservationInput } from './dtos/patch-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
  ) {}

  async makeReservation(
    authUser: User,
    makeReservation: MakeReservationDto,
  ): Promise<MakeReservationOutput> {
    const { isVaccinated, placeId, startTime } = makeReservation;
    console.log(makeReservation);
    try {
      const targetPlace = await this.placeRepository.findOne({
        where: {
          id: placeId,
        },
      });
      if (!targetPlace) {
        return {
          ok: false,
          error: '존재하지 않는 써클입니다.',
        };
      }
      if (targetPlace.isClosed) {
        return {
          ok: false,
          error: '이미 마감된 써클입니다.',
        };
      }
      const exists = await this.reservationRepository.findOne({
        where: {
          place_id: placeId,
          user_id: authUser.id,
          isCanceled: false,
        },
      });
      if (exists) {
        return {
          ok: false,
          error: '이미 신청하셨습니다.',
        };
      }

      const reservation = this.reservationRepository.create({
        place_id: placeId,
        user_id: authUser.id,
        isCanceled: false,
        isVaccinated,
        startTime,
      });
      await this.reservationRepository.save(reservation);

      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getReservationParticipantNumber(
    placeId: string,
  ): Promise<GetReservationParticipantNumberOutput> {
    try {
      const place = await this.placeRepository.find({
        where: {
          id: placeId,
        },
      });
      if (!place) {
        return {
          ok: false,
          error: '존재하지 않는 써클입니다.',
        };
      }
      const count_reservation_at_four = await this.reservationRepository.count({
        where: {
          place_id: placeId,
          startTime: StartTime.Four,
          isCanceled: false,
        },
      });
      const count_reservation_at_seven = await this.reservationRepository.count(
        {
          where: {
            place_id: placeId,
            startTime: StartTime.Seven,
            isCanceled: false,
          },
        },
      );

      return {
        ok: true,
        info: [
          {
            startTime: StartTime.Four,
            participantNumber: count_reservation_at_four,
          },
          {
            startTime: StartTime.Seven,
            participantNumber: count_reservation_at_seven,
          },
        ],
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async patchReservation(
    authUser: User,
    placeId: string,
    patchReservationInput: PatchReservationInput,
  ): Promise<DeleteReservationOutput> {
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
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
