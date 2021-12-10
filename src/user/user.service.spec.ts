import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationRepository } from '@reservation/repository/reservation.repository';
import { S3Service } from '@aws/s3/s3.service';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

const mockUserRepository = {
  findRandomUser: jest.fn(),
  findOne: jest.fn(),
};

const mockReservationRepository = {
  find: jest.fn(),
  count: jest.fn(),
};
const mockS3Service = {
  uploadToS3: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(ReservationRepository),
          useValue: mockReservationRepository,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserRepository));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.todo('findUserById');
  it.todo('me');
  it.todo('seeRandomProfile');
  it.todo('seeUserById');
  it.todo('getMyPlace');
  it.todo('editProfile');
});
