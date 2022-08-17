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
      androidRecommendedVersion: 13,
      androidMinimumVersion: 13,
      iOSRecommendedVersion: 11,
      iOSMinimumVersion: 11,
    };
  }
}
