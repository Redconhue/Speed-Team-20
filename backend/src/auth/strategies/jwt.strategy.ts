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
    // 完全避免使用 ExtractJwt.fromAuthHeaderAsBearerToken()，手动实现相同的功能
    const jwtFromRequest = (req: any): string | null => {
      const authHeader = req.headers?.authorization;
      if (authHeader && typeof authHeader === 'string') {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          return parts[1];
        }
      }
      return null;
    };

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
      
      const user = await this.usersService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }
      
      return user;
    } catch {
      // 完全移除未使用的 error 参数
      throw new UnauthorizedException('认证失败');
    }
  }
}
