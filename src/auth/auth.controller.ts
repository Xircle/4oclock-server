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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create')
  @ApiCreatedResponse({ description: '유저 생성' })
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

@ApiTags('Auth/Social')
@Controller('auth/social')
export class SocialAuthController {
  constructor(private socialAuthService: SocialAuthService) {}

  @Post('register/:provider')
  @ApiCreatedResponse({ description: '유저 소셜 계정 생성' })
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

  @Get('redirect/:provider')
  @ApiOkResponse()
  @ApiResponse({ status: 401, description: '유저 소셜 계정 생성 필요' })
  async socialRedirect(
    @Param('provider') provider: string,
    @Query('email') email: string,
  ): Promise<SocialRedirectOutput> {
    return this.socialAuthService.socialRedirect(provider, email);
  }
}
