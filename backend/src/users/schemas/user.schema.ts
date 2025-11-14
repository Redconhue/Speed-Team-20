import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

// Import bcrypt with proper typing
import * as bcrypt from 'bcryptjs';

// 核心 User 接口
export interface User extends Document {
  _id: ObjectId;
  username: string;
  password: string;
  email: string;
  role: 'user' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema 定义类
@Schema()
export class UserModel {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: 'user' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

// 密码加密中间件
UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // Properly type the error and handle it
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('Unknown error occurred during password hashing'));
    }
  }
});

// 密码验证方法
UserSchema.methods.comparePassword = function (this: User, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 合并类型
export type UserDocument = User & Document;
