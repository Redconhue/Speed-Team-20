import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

// 定义 JWT payload 接口
interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken() as () => string | null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'speed-team-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      // 添加类型检查
      if (!payload || typeof payload.sub !== 'string') {
        throw new UnauthorizedException('无效的令牌载荷');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const user = await this.usersService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }
      return user;
    } catch (_error) { // 使用 _error 表示故意不使用
      throw new UnauthorizedException('认证失败');
    }
  }
}
