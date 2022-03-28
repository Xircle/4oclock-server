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
      androidMinimumVersion: 2,
      iOSRecommendedVersion: 1,
      iOSMinimumVersion: 1,
    };
  }
}
