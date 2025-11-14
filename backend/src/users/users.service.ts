import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserModel, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  // 模型类型绑定为 Model<UserDocument>
  constructor(@InjectModel(UserModel.name) private userModel: Model<UserDocument>) {}

  // 创建用户 - 返回 UserDocument 类型
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    if (!createUserDto.username || !createUserDto.password || !createUserDto.email) {
      throw new BadRequestException('用户名、密码、邮箱不能为空');
    }

    const existingUser = await this.userModel.findOne({
      $or: [{ username: createUserDto.username }, { email: createUserDto.email }],
    });
    if (existingUser) {
      throw new BadRequestException('用户名或邮箱已被占用');
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  // 根据用户名查询 - 返回 UserDocument 类型
  async findByUsername(username: string): Promise<UserDocument> {
    if (!username) throw new BadRequestException('用户名不能为空');
    
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  // 根据ID查询 - 返回 UserDocument 类型
  async findById(id: string): Promise<UserDocument> {
    if (!id) throw new BadRequestException('用户ID不能为空');
    
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }
}