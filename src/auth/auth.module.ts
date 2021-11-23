import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserProfile } from '@user/entities/user-profile.entity';
import { SocialAccount } from '@user/entities/social-account.entity';
import { S3Service } from '@aws/s3/s3.service';
import { AuthService, SocialAuthService } from './auth.service';
import { AuthController, SocialAuthController } from './auth.controller';
import { UserRepository } from '@user/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, SocialAccount, UserProfile]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, SocialAuthService, S3Service],
  controllers: [AuthController, SocialAuthController],
  exports: [JwtModule],
})
export class AuthModule {}
