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
    } catch (error: unknown) {
      // 明确的错误类型处理
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('注册失败');
    }
  }

  // 登录
  async login(loginDto: LoginDto) {
    try {
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
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      // 明确的错误类型处理
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('登录失败');
    }
  }

  // 生成JWT令牌 - 添加更明确的类型处理
  private generateToken(userId: string): string {
    const payload = { sub: userId };
    // 明确的类型断言
    const token: string = this.jwtService.sign(payload);
    return token;
  }
}
