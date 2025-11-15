import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'speed-team-secret-key', // 生产环境用环境变量
    });
  }

  async validate(payload: any) {
    try {
      return await this.usersService.findById(payload.sub);
    } catch (error) {
      throw new UnauthorizedException('认证失败');
    }
  }
}