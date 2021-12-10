import { UserRole } from '@user/entities/user.entity';
import { Test } from '@nestjs/testing';
import { PlaceService } from '@place/place.service';
import { ReservationRepository } from './repository/reservation.repository';
import { ReservationService } from './reservation.service';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { InternalServerErrorException } from '@nestjs/common';

const mockReservationRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  count: jest.fn(),
};
const mockPlaceService = {
  GetPlaceByIdAndcheckPlaceException: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ReservationService', () => {
  let reservationService: ReservationService;
  let reservationRepository: MockRepository<Reservation>;
  let placeService: typeof mockPlaceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: ReservationRepository,
          useValue: mockReservationRepository,
        },
        {
          provide: PlaceService,
          useValue: mockPlaceService,
        },
      ],
    }).compile();
    reservationService = module.get<ReservationService>(ReservationService);
    reservationRepository = module.get(ReservationRepository);
    placeService = module.get(PlaceService);
  });

  describe('makeReservation', () => {
    const authUserArgs = {
      id: '1',
      email: 'she_lock@naver.com',
      role: UserRole.Client,
    };
    const makeReservationArgs = {
      placeId: '31',
      isVaccinated: true,
    };
    test('should fail, if place is closed', async () => {
      placeService.GetPlaceByIdAndcheckPlaceException.mockResolvedValue({
        id: '31',
        isClosed: true,
      });
      const result = await reservationService.makeReservation(
        authUserArgs,
        makeReservationArgs,
      );
      expect(result).toMatchObject({
        ok: false,
        error: '이미 마감된 모임입니다.',
      });
    });

    test('should make reservation, if user reserved first time', async () => {
      const reservationEntity = {
        id: '1',
        placeId: makeReservationArgs.placeId,
        user_id: authUserArgs.id,
        isCanceled: false,
        isVaccinated: makeReservationArgs.isVaccinated,
      };
      placeService.GetPlaceByIdAndcheckPlaceException.mockResolvedValue({
        id: '42',
        isClosed: false,
      });
      reservationRepository.findOne.mockResolvedValue(undefined);
      reservationRepository.create.mockReturnValue(reservationEntity);
      reservationRepository.save.mockResolvedValue(reservationEntity);

      const result = await reservationService.makeReservation(
        authUserArgs,
        makeReservationArgs,
      );

      expect(reservationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(reservationRepository.findOne).toHaveBeenCalledWith({
        where: {
          place_id: makeReservationArgs.placeId,
          user_id: authUserArgs.id,
        },
      });
      expect(reservationRepository.create).toHaveBeenCalledTimes(1);
      expect(reservationRepository.create).toHaveBeenCalledWith({
        place_id: makeReservationArgs.placeId,
        user_id: authUserArgs.id,
        isCanceled: false,
        isVaccinated: makeReservationArgs.isVaccinated,
      });
      expect(reservationRepository.save).toHaveBeenCalledTimes(1);
      expect(reservationRepository.save).toHaveBeenCalledWith(
        reservationEntity,
      );
      expect(result).toMatchObject({ ok: true });
    });

    test('should update reservation, if user have reserved before', async () => {
      const reservationEntity = {
        id: '1',
        placeId: makeReservationArgs.placeId,
        user_id: authUserArgs.id,
        isCanceled: true,
        isVaccinated: makeReservationArgs.isVaccinated,
      };
      placeService.GetPlaceByIdAndcheckPlaceException.mockResolvedValue({
        id: '42',
        isClosed: false,
      });
      reservationRepository.findOne.mockResolvedValue(reservationEntity);

      const result = await reservationService.makeReservation(
        authUserArgs,
        makeReservationArgs,
      );

      expect(reservationRepository.update).toHaveBeenCalledTimes(1);
      expect(reservationRepository.update).toHaveBeenCalledWith(
        {
          user_id: authUserArgs.id,
          place_id: makeReservationArgs.placeId,
        },
        {
          isVaccinated: makeReservationArgs.isVaccinated,
          isCanceled: false,
          cancelReason: null,
          detailReason: null,
        },
      );
      expect(result).toMatchObject({ ok: true });
    });

    test('should fail, if user already reserved ', async () => {
      const reservationEntity = {
        id: '1',
        placeId: makeReservationArgs.placeId,
        user_id: authUserArgs.id,
        isCanceled: false,
        isVaccinated: makeReservationArgs.isVaccinated,
      };
      placeService.GetPlaceByIdAndcheckPlaceException.mockResolvedValue({
        id: '42',
        isClosed: false,
      });
      reservationRepository.findOne.mockResolvedValue(reservationEntity);

      const result = await reservationService.makeReservation(
        authUserArgs,
        makeReservationArgs,
      );

      expect(result).toMatchObject({
        ok: false,
        error: '이미 신청하셨습니다.',
      });
    });

    test('should fail, on exception', async () => {
      placeService.GetPlaceByIdAndcheckPlaceException.mockRejectedValue(
        new Error(),
      );
      expect(
        reservationService.makeReservation(authUserArgs, makeReservationArgs),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  test.todo('getReservationParticipantNumber');
  test.todo('patchReservation');
});
