import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Types } from 'mongoose';

// Add interface for user response
interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: UserResponse;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
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
      // Safe error message access with proper type checking
      let errorMessage = '注册失败';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: unknown }).message);
      }
      throw new BadRequestException(errorMessage);
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
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
      
      // Safe error message access with proper type checking
      let errorMessage = '登录失败';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: unknown }).message);
      }
      throw new BadRequestException(errorMessage);
    }
  }

  private generateToken(userId: string): string {
    const payload = { sub: userId };
    // Add type assertion to fix the unsafe call/member access errors
    return (this.jwtService as { sign: (payload: any) => string }).sign(payload);
  }
}
