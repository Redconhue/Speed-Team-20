import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

// 扩展 Express Request 类型以包含 user 属性
interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    // 根据你的用户模型添加其他属性
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user; // 现在有明确的类型定义
  }
}
