import { UserService } from './../../user/user.service';
import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    super();
  }

  /**
   *
   * 토큰이 유효한지 체크가 되면 decoded["id"]를 통해 User 객체를 가져와서 req.user에 붙인다.
   * return 값은 ```@UseGuards(JwtAuthGuard)```를 사용한 모든 곳에 자동으로 Request 객체로서 들어간다.
   *
   * @param payload
   */
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { authorization } = req.headers;
    if (!authorization)
      throw new HttpException('Token does not exists', HttpStatus.UNAUTHORIZED);
    const token = authorization.replace('Bearer ', '');
    // Check token whether it is valid or not.
    const payload = await this.validateToken(token);
    if (!payload || !payload?.id) return false;

    // Attach user in req.user
    const user = await this.userService.findUserById(payload.id);
    req.user = user;
    return true;
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      console.log(e);
      switch (e.message) {
        case 'INVALID_TOKEN':
        case 'TOKEN_IS_ARRAY':
        case 'NO_USER':
          throw new HttpException('유효하지 않은 토큰입니다.', 401);
        case 'EXPIRED_TOKEN':
          throw new HttpException('토큰이 만료되었습니다.', 410);
        default:
          throw new HttpException('서버 오류입니다.', 500);
      }
    }
  }
}
