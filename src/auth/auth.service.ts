import { getManager, Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@user/entities/user.entity';
import { SocialAccount } from '@user/entities/social-account.entity';
import { S3Service } from '@aws/s3/s3.service';
import { UserRepository } from '@user/repositories/user.repository';
import { UserProfile } from '@user/entities/user-profile.entity';
import {
  AuthDataToFront,
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
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
      const accessToken = this.jwtService.sign({ id: user.id });
      return {
        ok: true,
        accessToken,
      };
    } catch (e) {
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
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepository: Repository<SocialAccount>,
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
    private readonly jwtService: JwtService,
  ) {}

  async socialRegister(
    socialRegisterInput: SocialRegisterInput,
    profileImageFile: Express.Multer.File,
    provider: string,
  ): Promise<SocialRegisterOutput> {
    const {
      profileImageUrl,
      socialId,
      email,
      phoneNumber,
      gender,
      username,
      university,
      isGraduate,
      age,
      job,
      shortBio,
      location,
      personality,
      MBTI,
      drinkingStyle,
      interests,
      isMarketingAgree,
      team,
    } = socialRegisterInput;

    try {
      let final_profile_image: string;
      if (profileImageUrl) {
        final_profile_image = profileImageUrl;
      } else {
        // Upload to S3
        final_profile_image = await this.s3Service.uploadToS3(
          profileImageFile,
          socialId,
        );
      }
      const exists = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      if (exists) {
        return {
          ok: false,
          error: '이미 존재하는 이메일입니다.',
        };
      }

      let data: AuthDataToFront;

      // Transaction Start
      await getManager().transaction(async (transactionalEntityManager) => {
        // Create user
        const user = this.userRepository.create({
          email,
          isVerified: false,
          role: UserRole.Client,
        });
        await transactionalEntityManager.save(user);

        // Create profile
        const profile = this.userProfileRepository.create({
          username,
          university,
          isGraduate,
          phoneNumber,
          age,
          gender,
          job,
          shortBio,
          personality,
          MBTI,
          drinkingStyle,
          location,
          profileImageUrl: final_profile_image,
          interests,
          isMarketingAgree,
          fk_user_id: user.id,
          team
        });
        await transactionalEntityManager.save(profile);

        // Create social account
        const socialAccount = this.socialAccountRepository.create({
          socialId,
          provider,
          user,
          fk_user_id: user.id,
        });
        await transactionalEntityManager.save(socialAccount);
        data = {
          token: this.jwtService.sign({ id: user.id }),
          uid: user.id,
          username,
          email,
          profile: {
            id: profile.id,
            thumbnail: profile.profileImageUrl,
          },
        };
      });
      return {
        ok: true,
        data,
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async socialRedirect(email: string): Promise<SocialRedirectOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
        relations: ['profile'],
      });
      if (user) {
        const token = this.jwtService.sign({ id: user.id });
        return {
          ok: true,
          code: 200,
          data: {
            token,
            uid: user.id,
            username: user.profile?.username,
            email: user.email,
            profile: {
              id: user.profile.id,
              thumbnail: user.profile.profileImageUrl,
            },
          },
        };
      } else {
        return {
          ok: true,
          code: 401,
        };
      }
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
