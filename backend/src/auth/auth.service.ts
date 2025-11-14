import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto) as UserDocument;

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
      const errorMessage = error instanceof Error ? error.message : '注册失败';
      throw new BadRequestException(errorMessage);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByUsername(loginDto.username) as UserDocument;

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
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      throw new BadRequestException(errorMessage);
    }
  }

  private generateToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}