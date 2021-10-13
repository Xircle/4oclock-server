import { UserService } from './../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ChatsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient();

    const token = client.handshake.auth?.authorization;
    const payload = this.validateToken(token);

    if (!payload || !payload?.id) return false;
    const exists = await this.userService.findUserById(payload.id);
    if (!exists) return false;
    console.log('connected Socket user : ', exists);
    return true;
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
