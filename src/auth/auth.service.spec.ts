import * as typeorm from 'typeorm';
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

const mockUserProfileRepository = { create: jest.fn(), save: jest.fn() };
const mockSocialAccountRepository = { create: jest.fn(), save: jest.fn() };
const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
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
type MockRepository<T = any> = Partial<
  Record<keyof typeorm.Repository<T>, jest.Mock>
>;

describe('SocialAuthService', () => {
  let socialAuthService: SocialAuthService;
  let userRepository: MockRepository<User>;
  let userProfileRepository: MockRepository<UserProfile>;
  let socialAccountRepository: MockRepository<SocialAccount>;
  let s3Service: S3Service;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
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
    socialAuthService = module.get(SocialAuthService);
    userRepository = module.get(UserRepository);
    userProfileRepository = module.get(getRepositoryToken(UserProfile));
    socialAccountRepository = module.get(getRepositoryToken(SocialAccount));
    s3Service = module.get(S3Service);
    configService = module.get(ConfigService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(socialAuthService).toBeDefined();
  });

  describe('socialRegister', () => {
    const socialRegisterArgs = {
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
    };
    const profileImageFileArgs = {
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
    };

    it('should upload file to s3, if profileImageUrl does not exist', async () => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'she_lock@naver.com',
      });
      await socialAuthService.socialRegister(
        { ...socialRegisterArgs, profileImageUrl: null },
        profileImageFileArgs,
        'kakao',
      );
      expect(s3Service.uploadToS3).toHaveBeenCalledTimes(1);
      expect(s3Service.uploadToS3).toHaveBeenCalledWith(
        profileImageFileArgs,
        socialRegisterArgs.socialId,
      );
    });

    it('should fail, if user exists', async () => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'she_lock@naver.com',
      });
      const result = await socialAuthService.socialRegister(
        socialRegisterArgs,
        profileImageFileArgs,
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

  it.todo('socialRegister.transaction');
  it.todo('socialRedirect');
});
