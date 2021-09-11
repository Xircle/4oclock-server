import { UserProfile } from '../user/entities/user-profile.entity';
import {
  SocialRedirectInput,
  SocialRedirectOutput,
  SocialRegisterInput,
  SocialRegisterOutput,
} from './dtos/social-register.dto';
import {
  CreateUserInput,
  CreateUserOutput,
  LoginUserInput,
  LoginUserOutput,
} from './dtos/create-user.dto';
import { User, UserRole } from './../user/entities/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from 'src/aws/s3/s3.service';
import SocialAccount from 'src/user/entities/social-account.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(
    createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    const { email, password } = createUserInput;
    try {
      const exists = await this.userRepository.findOne({
        email,
      });

      if (exists) {
        return {
          ok: false,
          error: '이미 존재하는 계정입니다.',
        };
      }
      await this.userRepository.save(
        this.userRepository.create({
          email,
          password,
        }),
      );
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Internal server error',
      };
    }
  }

  async loginUser(loginUserInput: LoginUserInput): Promise<LoginUserOutput> {
    const { email, password } = loginUserInput;
    try {
      const user = await this.userRepository.findOne(
        {
          email,
        },
        {
          select: ['password', 'id'],
        },
      );
      if (!user)
        return {
          ok: false,
          error: '존재하지 않는 아이디입니다.',
        };

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect)
        return {
          ok: false,
          error: '비밀번호가 일치하지 않습니다.',
        };

      // create token
      const accessToken = this.jwtService.sign({ email });
      return {
        ok: true,
        accessToken,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Internal server error',
      };
    }
  }
}

@Injectable()
export class SocialAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepository: Repository<SocialAccount>,
    private readonly s3Service: S3Service,
  ) {}

  async socialRegister(
    socialRegisterInput: SocialRegisterInput,
    profileImageFile: Express.Multer.File,
    provider: string,
  ): Promise<SocialRegisterOutput> {
    const {
      uid,
      email,
      phoneNumber,
      gender,
      username,
      university,
      isGraduate,
      age,
      isProfilePrivate,
      job,
      shortBio,
      location,
      interests,
      isMarketingAgree,
    } = socialRegisterInput;

    try {
      // Upload to S3
      const profileImg_s3_url = await this.s3Service.uploadToS3(
        profileImageFile,
        uid,
      );

      // Create user
      const user = this.userRepository.create({
        email,
        username,
        isVerified: false,
        role: UserRole.Client,
      });
      await this.userRepository.save(user);

      // Create profile
      const profile = this.userProfileRepository.create({
        username,
        phoneNumber,
        university,
        isGraduate,
        age,
        gender,
        isProfilePrivate,
        job,
        shortBio,
        location,
        profileImageUrl: profileImg_s3_url,
        interests,
        isMarketingAgree,
        fkUserId: user.id,
      });
      await this.userProfileRepository.save(profile);

      // Create social account
      const socialAccount = this.socialAccountRepository.create({
        socialId: uid,
        provider,
        user,
      });
      await this.socialAccountRepository.save(socialAccount);

      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async socialRedirect(
    socialRedirectInput: SocialRedirectInput,
    provider: string,
  ): Promise<SocialRedirectOutput> {
    const { email } = socialRedirectInput;
    if (!email) {
      return {
        ok: false,
        error: '가입을 위해 이메일이 필요합니다. 이메일 동의를 해주세요!',
      };
    }
    try {
      const exists = await this.userRepository.findOne({
        email,
      });
      if (exists) {
        // Get user data 
        const user = await this.userRepository.findOne(
          {
            email,
          },
          {
            select: ['id', 'username', 'email'],
            relations: ['profile'],
          },
        );
        return {
          ok: true,
          code: 201,
          user,
        };
      } else {
        return {
          ok: true,
          code: 401,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Internal server error',
      };
    }
  }
}
