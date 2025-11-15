import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common'; // 导入 NotFoundException
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { Types } from 'mongoose'; // 导入 Types，使用其 ObjectId 构造函数

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 注册
  async register(createUserDto: CreateUserDto) {
    try {
      // 类型断言为 UserDocument
      const user = await this.usersService.create(createUserDto) as UserDocument;
      
      // 修复：用 Types.ObjectId 构造函数做 instanceof 校验（值类型）
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
      throw new BadRequestException(error.message || '注册失败');
    }
  }

  // 登录
  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByUsername(loginDto.username) as UserDocument;
      
      // 修复：用 Types.ObjectId 构造函数
      if (!user || !(user._id instanceof Types.ObjectId)) {
        throw new NotFoundException('用户不存在');
      }
      
      // 验证密码
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
      // 修复：NotFoundException 已导入
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || '登录失败');
    }
  }

  // 生成JWT令牌
  private generateToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}