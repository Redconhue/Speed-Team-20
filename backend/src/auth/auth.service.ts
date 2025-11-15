import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 注册
  async register(createUserDto: CreateUserDto) {
    try {
      // 移除 UserDocument 类型断言，依赖接口类型
      const user = await this.usersService.create(createUserDto);
      
      if (!user || !(user._id instanceof Types.ObjectId)) {
        throw new BadRequestException('用户创建失败');
      }
      
      const userId = user._id.toString();
      const token = this.generateToken(userId);
      
      return {
        token,
        user: {
          id: userId,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : '注册失败';
      throw new BadRequestException(message);
    }
  }

  // 登录
  async login(loginDto: LoginDto) {
    try {
      // 移除 UserDocument 类型断言
      const user = await this.usersService.findByUsername(loginDto.username);
      
      if (!user || !(user._id instanceof Types.ObjectId)) {
        throw new NotFoundException('用户不存在');
      }
      
      const isPasswordValid = await user.comparePassword(loginDto.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('密码错误');
      }
      
      const userId = user._id.toString();
      const token = this.generateToken(userId);
      
      return {
        token,
        user: {
          id: userId,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : '登录失败';
      throw new BadRequestException(message);
    }
  }

  // 生成JWT令牌
  private generateToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload) as string;
  }
}
