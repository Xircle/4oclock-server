import { Body, Injectable, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUserDto';

@Injectable()
export class UserService {
  @Post('/')
  createUser(@Body() createUserDto: CreateUserDto) {}
}
