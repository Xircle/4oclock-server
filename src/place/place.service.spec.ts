import { Repository } from 'typeorm';
import { PlaceService } from '@place/place.service';
import { S3Service } from '@aws/s3/s3.service';
import { Test } from '@nestjs/testing';
import { ReservationRepository } from '@reservation/repository/reservation.repository';
import { PlaceRepository } from './repository/place.repository';
import { PlaceDetailRepository } from './repository/place-detail.repository';
import { HttpException, InternalServerErrorException } from '@nestjs/common';

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

  describe('getPlaceById', () => {});

  it.todo('getPlacesByLocation');
  it.todo('getPlaceById');
  it.todo('createPlace');
  it.todo('deletePlace');
  it.todo('editPlace');
});
