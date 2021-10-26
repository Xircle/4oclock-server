import { ConfigService } from '@nestjs/config';
import { User } from './../../user/entities/user.entity';
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import jwt from 'jsonwebtoken';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization;
      const payload = jwt.verify(
        token,
        this.configService.get('JWT_SECRET_KEY'),
      );
      const user = await this.userRepository.findOne({
        where: {
          id: payload['id'],
        },
      });
      request.user = user;
    } catch (err) {
      console.log('Verify failed');
      request.user = undefined;
    } finally {
      return handler.handle();
    }
  }
}
