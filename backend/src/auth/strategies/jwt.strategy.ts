import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    
    const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'speed-team-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      if (!payload || typeof payload.sub !== 'string') {
        throw new UnauthorizedException('无效的令牌载荷');
      }
      
      const user = await this.usersService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }
      
      return user;
    } catch {
      throw new UnauthorizedException('认证失败');
    }
  }
}
