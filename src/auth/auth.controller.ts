import { ParsePipe } from './../common/pipe/parse.pipe';
import {
  SocialRedirectOutput,
  SocialRegisterInput,
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
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('profileImageFile'))
  async socialRegister(
    @UploadedFile() file: Express.Multer.File,
    @Param('provider') provider: string,
    @Body(new ParsePipe())
    socialRegisterInput: SocialRegisterInput,
  ): Promise<SocialRegisterOutput> {
    console.log(socialRegisterInput);
    return this.socialAuthService.socialRegister(
      socialRegisterInput,
      file,
      provider,
    );
  }

  @Get('redirect/')
  async socialRedirect(
    @Query('email') email: string,
    @Param('provider') provider: string,
  ): Promise<SocialRedirectOutput> {
    return this.socialAuthService.socialRedirect(email, provider);
  }
}
