import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UserService } from '@user/user.service';

@Injectable()
export class ChatsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient();

    const BearerToken = client.handshake.auth?.authorization as string;
    const token = BearerToken.replace('Bearer ', '');
    const payload = this.validateToken(token);
    if (!payload || !payload?.id) return false;
    const exists = await this.userService.findUserById(payload.id);
    if (!exists) return false;
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
