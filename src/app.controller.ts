import { ConfigService } from '@nestjs/config';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('config')
  // getEnv(): string {
  //   console.log(process.env.JWT_SECRET_KEY);
  //   return this.configService.get('DATABASE_URL');
  // }
}
