import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { S3Service } from '@aws/s3/s3.service';
import { SocialAuthService } from './auth.service';
import { User } from '@user/entities/user.entity';
import { UserRepository } from '@user/repositories/user.repository';
import { Gender, UserProfile } from '@user/entities/user-profile.entity';
import { SocialAccount } from '@user/entities/social-account.entity';
import { JwtService } from '@nestjs/jwt';
import { Readable } from 'stream';

const mockUserProfileRepository = { create: jest.fn() };
const mockSocialAccountRepository = { create: jest.fn() };
const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
};
const mockS3Service = {
  uploadToS3: jest.fn(),
};
const mockConfigService = {
  get: jest.fn(),
};
const mockJwtService = {
  sign: jest.fn(),
};
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('SocialAuthService', () => {
  let socialAuthService: SocialAuthService;
  let userRepository: MockRepository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SocialAuthService,
        {
          provide: getRepositoryToken(UserProfile),
          useValue: mockUserProfileRepository,
        },
        {
          provide: getRepositoryToken(SocialAccount),
          useValue: mockSocialAccountRepository,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    socialAuthService = module.get<SocialAuthService>(SocialAuthService);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(socialAuthService).toBeDefined();
  });

  describe('socialRegister', () => {
    it('should fail, if user exists', async () => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'she_lock@naver.com',
      });
      const result = await socialAuthService.socialRegister(
        {
          profileImageUrl: expect.any(String),
          socialId: expect.any(String),
          email: expect.any(String),
          phoneNumber: expect.any(String),
          gender: Gender.Male,
          username: expect.any(String),
          university: expect.any(String),
          isGraduate: expect.any(Boolean),
          age: expect.any(Number),
          job: expect.any(String),
          shortBio: expect.any(String),
          location: expect.any(String),
          personality: expect.any(String),
          MBTI: expect.any(String),
          drinkingStyle: expect.any(Number),
          interests: [expect.any(String)],
          isMarketingAgree: expect.any(Boolean),
        },
        {
          fieldname: '',
          originalname: '',
          mimetype: '',
          size: 1,
          stream: new Readable(),
          destination: '',
          encoding: '',
          filename: '',
          path: '',
          buffer: Buffer.from(''),
        },
        'kakao',
      );

      expect(result).toMatchObject({
        ok: false,
        error: '이미 존재하는 이메일입니다.',
      });
    });
  });

  describe('socialRedirect', () => {
    it('should return code 200, if user exists', () => {
      userRepository.findOne.mockResolvedValue({});
    });
  });

  it.todo('socialRegister');
  it.todo('socialRedirect');
});
