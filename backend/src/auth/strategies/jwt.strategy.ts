import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: (req: Request): string | null => {
        const authHeader = req.headers?.authorization;
        if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
          return authHeader.substring(7);
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: getSecretKey(),
    });
  }

  async validate(payload: { sub: string }): Promise<unknown> {
    const userId = payload.sub;
    if (!userId) {
      throw new Error('Invalid token payload');
    }
    
    const user = await this.usersService.findById(userId);
    return user;
  }
}

function getSecretKey(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}
