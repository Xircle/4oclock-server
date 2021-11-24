import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  sayHello() {
    return 'Hello developers!';
  }
}
