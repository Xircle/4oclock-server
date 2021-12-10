import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { PlaceService } from '@place/place.service';
import { S3Service } from '@aws/s3/s3.service';
import { ReservationRepository } from '@reservation/repository/reservation.repository';
import { PlaceDetailRepository } from './repository/place-detail.repository';
import { PlaceRepository } from './repository/place.repository';
import { UserRole } from '@user/entities/user.entity';

const MockReservationRepository = {
  count: jest.fn(),
  getNotCanceledReservations: jest.fn(),
  isParticipating: jest.fn(),
  getParticipantsProfile: jest.fn(),
};
const MockPlaceRepository = {
  findOneByPlaceId: jest.fn(),
  findManyPlaces: jest.fn(),
  savePlace: jest.fn(),
  getPlaceMetaData: jest.fn(),
  findDetailPlaceByPlaceId: jest.fn(),
  updatePlace: jest.fn(),
  delete: jest.fn(),
};
const MockPlaceDetailRepository = {
  createAndSavePlaceDetail: jest.fn(),
};
const mockS3Service = {
  uploadToS3: jest.fn(),
};
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PlaceService', () => {
  let placeService: PlaceService;
  let reservationRepository: typeof MockReservationRepository;
  let placeRepository: typeof MockPlaceRepository;
  let placeDetailRepository: typeof MockPlaceDetailRepository;
  let s3Service: S3Service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PlaceService,
        {
          provide: ReservationRepository,
          useValue: MockReservationRepository,
        },
        {
          provide: PlaceRepository,
          useValue: MockPlaceRepository,
        },
        {
          provide: PlaceDetailRepository,
          useValue: MockPlaceDetailRepository,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();
    placeService = module.get<PlaceService>(PlaceService);
    reservationRepository = module.get(ReservationRepository);
    placeRepository = module.get(PlaceRepository);
    placeDetailRepository = module.get(PlaceDetailRepository);
    s3Service = module.get(S3Service);
  });

  describe('GetPlaceByIdAndcheckPlaceException', () => {
    const placeIdArgs = '64';
    it('should fail, if place does not exist', async () => {
      placeRepository.findOneByPlaceId.mockResolvedValue(undefined);
      expect(
        placeService.GetPlaceByIdAndcheckPlaceException(placeIdArgs),
      ).rejects.toThrow(HttpException);
    });
    it('should return place, if place exist', async () => {
      placeRepository.findOneByPlaceId.mockResolvedValue({
        id: placeIdArgs,
      });
      const result = await placeService.GetPlaceByIdAndcheckPlaceException(
        placeIdArgs,
      );
      expect(result).toMatchObject({ id: placeIdArgs });
    });
  });

  describe('getPlacesByLocation', () => {
    it('should fail on exception', async () => {
      placeRepository.findManyPlaces.mockRejectedValue(new Error());
      expect(
        placeService.getPlacesByLocation(
          expect.any(String),
          expect.any(Number),
          expect.any(Number),
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getPlaceById', () => {
    const placeId = '67';
    const authUserArgs = {
      id: '12',
      email: 'she_lock@naver.com',
      role: UserRole.Client,
    };
    test('should fail, if place does not exist', async () => {
      placeRepository.findDetailPlaceByPlaceId.mockResolvedValue(undefined);
      const result = await placeService.getPlaceById(authUserArgs, placeId);
      expect(placeRepository.findDetailPlaceByPlaceId).toHaveBeenCalledTimes(1);
      expect(placeRepository.findDetailPlaceByPlaceId).toHaveBeenCalledWith(
        placeId,
      );
      expect(result).toMatchObject({
        ok: false,
        error: '존재하지 않는 장소입니다.',
      });
    });

    test('should return placeDatas', async () => {
      const placeEntity = {
        placeId,
        views: 5,
        placeDetail: {
          maxParticipantsNumber: 10,
        },
        getStartDateFromNow: jest.fn(() => '오늘 14'),
      };

      const mockNotCanceledReservations = [
        {
          id: '12',
          participant: {
            profile: {
              username: '2donny',
            },
          },
        },
        {
          id: '13',
          participant: {
            profile: {
              username: '3donny',
            },
          },
        },
      ];

      placeRepository.findDetailPlaceByPlaceId.mockResolvedValue(placeEntity);
      placeRepository.updatePlace.mockResolvedValue(undefined);
      placeEntity.views++;
      reservationRepository.getNotCanceledReservations.mockResolvedValue(
        mockNotCanceledReservations,
      );
      reservationRepository.isParticipating.mockResolvedValue(true);

      const result = await placeService.getPlaceById(authUserArgs, placeId);
      expect(placeRepository.updatePlace).toHaveBeenCalledTimes(1);
      expect(placeRepository.updatePlace).toHaveBeenCalledWith(
        {
          id: placeEntity.placeId,
        },
        {
          views: placeEntity.views + 1,
        },
      );

      expect(
        reservationRepository.getNotCanceledReservations,
      ).toHaveBeenCalledTimes(1);
      expect(
        reservationRepository.getNotCanceledReservations,
      ).toHaveBeenCalledWith(placeId);

      expect(reservationRepository.isParticipating).toHaveBeenCalledTimes(1);
      expect(reservationRepository.isParticipating).toHaveBeenCalledWith(
        authUserArgs.id,
        placeId,
      );
      expect(result).toMatchObject({
        ok: true,
        placeData: {
          views: 6,
          participantsData: {
            leftParticipantsCount: 8,
            participantsCount: 2,
            participantsUsername: ['2donny', '3donny'],
          },
        },
      });
    });

    test('should fail, on exception', async () => {
      placeRepository.updatePlace.mockRejectedValue(new Error());
      expect(placeService.getPlaceById(authUserArgs, placeId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  it.todo('getPlacesByLocation');
  it.todo('getPlaceById');
  it.todo('createPlace');
  it.todo('deletePlace');
  it.todo('editPlace');
});
