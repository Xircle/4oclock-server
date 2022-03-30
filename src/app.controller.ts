import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  sayHello() {
    return 'Hello developersxxxx!';
  }

  @Get('version')
  getVersion() {
    return {
      androidRecommendedVersion: 2,
      androidMinimumVersion: 1,
      iOSRecommendedVersion: 2,
      iOSMinimumVersion: 1,
    };
  }
}
