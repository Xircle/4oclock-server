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
      androidRecommendedVersion: 10,
      androidMinimumVersion: 10,
      iOSRecommendedVersion: 10,
      iOSMinimumVersion: 10,
    };
  }
}
