import * as typeorm from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { S3Service } from '@aws/s3/s3.service';
import { AuthService, SocialAuthService } from './auth.service';
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
const mockJwtService = () => ({
  sign: jest.fn(() => 'Jwt-secret-token-baby'),
});
type MockRepository<T = any> = Partial<
  Record<keyof typeorm.Repository<T>, jest.Mock>
>;

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: MockRepository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('createUser', () => {
    const userArgs = {
      email: 'she_lock@naver.com',
      password: 'test123',
    };
    it('should fail, if user exist', async () => {
      userRepository.findOne.mockResolvedValue({ email: 'she_lock@naver.com' });
      const result = await authService.createUser(userArgs);
      expect(result).toMatchObject({
        ok: false,
        error: '이미 존재하는 계정입니다.',
      });
    });

    it('should create a new user', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(userArgs);
      userRepository.save.mockResolvedValue(undefined);
      const result = await authService.createUser(userArgs);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(userArgs);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(userArgs);
      expect(result).toMatchObject({ ok: true });
    });

    it('should return InternelServerException', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      userRepository.create.mockRejectedValue(new Error());
      userRepository.save.mockRejectedValue(new Error());

      const result = await authService.createUser(userArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'Internal server error',
      });
    });
  });

  describe('loginUser', () => {
    it('should fail, if user does exist', async () => {
      const userArgs = {
        email: 'she_lock@naver.com',
        password: 'test123',
      };
      userRepository.findOne.mockResolvedValue(undefined);
      const result = await authService.loginUser(userArgs);
      expect(result).toMatchObject({
        ok: false,
        error: '존재하지 않는 아이디입니다.',
      });
    });

    it('should fail, if password does not correct', async () => {
      const userArgs = {
        email: 'she_lock@naver.com',
        password: 'test123',
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      userRepository.findOne.mockResolvedValue(userArgs);
      const result = await authService.loginUser(userArgs);
      expect(result).toMatchObject({
        ok: false,
        error: '비밀번호가 일치하지 않습니다.',
      });
    });

    it('should return accessToken, if password is correct', async () => {
      const userArgs = {
        id: '64',
        email: 'she_lock@naver.com',
        password: 'test123',
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      userRepository.findOne.mockResolvedValue(userArgs);
      const result = await authService.loginUser(userArgs);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: userArgs.id });
      expect(result).toMatchObject({
        ok: true,
        accessToken: 'Jwt-secret-token-baby',
      });
    });

    it('should return InternelServerException', async () => {
      const userArgs = {
        email: 'she_lock@naver.com',
        password: 'test123',
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await authService.loginUser(userArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'Internal server error',
      });
    });
  });
});

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
          useValue: mockJwtService(),
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
    it('should return code 200, if user exists', async () => {
      userRepository.findOne.mockResolvedValue({
        id: expect.any(String),
        email: expect.any(String),
        profile: {
          id: expect.any(String),
          username: expect.any(String),
          profileImageUrl: expect.any(String),
        },
      });
      const result = await socialAuthService.socialRedirect(
        'she_lock@naver.com',
      );
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: expect.any(String) });
      expect(result).toMatchObject({
        ok: true,
        code: 200,
        data: {
          token: 'Jwt-secret-token-baby',
          uid: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          profile: {
            id: expect.any(String),
            thumbnail: expect.any(String),
          },
        },
      });
    });

    it('should return code 401, if user does not exists', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      const result = await socialAuthService.socialRedirect(
        'she_lock@naver.com',
      );
      expect(result).toMatchObject({
        ok: true,
        code: 401,
      });
    });

    it('should return InternelServerException', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      await expect(
        socialAuthService.socialRedirect('she_lock@naver.com'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  it.todo('socialRegister.transaction');
});
