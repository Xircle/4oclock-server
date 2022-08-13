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
      androidRecommendedVersion: 17,
      androidMinimumVersion: 17,
      iOSRecommendedVersion: 17,
      iOSMinimumVersion: 17,
    };
  }
}
