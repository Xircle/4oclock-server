import { ConfigService, ConfigModule } from '@nestjs/config';
import { UserProfile } from '../user/entities/user-profile.entity';
import { JwtStrategy } from './jwt.strategy';
import { User } from './../user/entities/user.entity';
import { Module } from '@nestjs/common';
import { AuthService, SocialAuthService } from './auth.service';
import { AuthController, SocialAuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SocialAccount } from 'src/user/entities/social-account.entity';
import { S3Service } from 'src/aws/s3/s3.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, SocialAccount, UserProfile]),
  ],
  providers: [AuthService, SocialAuthService, JwtStrategy, S3Service],
  controllers: [AuthController, SocialAuthController],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
