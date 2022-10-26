import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  sayHello() {
    return 'hi';
  }

  @Get('version')
  getVersion() {
    return {
      androidRecommendedVersion: 20,
      androidMinimumVersion: 20,
      iOSRecommendedVersion: 20,
      iOSMinimumVersion: 20,
    };
  }
}
