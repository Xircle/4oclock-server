import { ParsePipe } from '../common/pipe/parse-pipe';
import {
  SocialRegisterInput,
  SocialRedirectInput,
  SocialRedirectOutput,
  SocialRegisterOutput,
} from './dtos/social-register.dto';
import {
  CreateUserInput,
  LoginUserInput,
  CreateUserOutput,
  LoginUserOutput,
} from './dtos/create-user.dto';
import { AuthService, SocialAuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Res,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JsonWebTokenError } from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create')
  async createUser(
    @Body() createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.authService.createUser(createUserInput);
  }

  @Post('login')
  async loginUser(
    @Body() loginUserInput: LoginUserInput,
  ): Promise<LoginUserOutput> {
    return this.authService.loginUser(loginUserInput);
  }
}

@Controller('auth/social')
export class SocialAuthController {
  constructor(private socialAuthService: SocialAuthService) {}

  @Post('register/:provider')
  @UseInterceptors(FileInterceptor('profile_image_file'))
  async socialRegister(
    @Body('profile_data', new ParsePipe())
    socialRegisterInput: SocialRegisterInput,
    @UploadedFile() file: Express.Multer.File,
    @Param('provider') provider: string,
  ): Promise<SocialRegisterOutput> {
    return this.socialAuthService.socialRegister(
      socialRegisterInput,
      file,
      provider,
    );
  }

  @Post('redirect/:provider')
  async socialRedirect(
    @Body() socialRedirectInput: SocialRedirectInput,
    @Param('provider') provider: string,
  ): Promise<SocialRedirectOutput> {
    return this.socialAuthService.socialRedirect(socialRedirectInput, provider);
  }
}
