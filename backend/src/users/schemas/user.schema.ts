import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

// Import with explicit type handling
import * as bcrypt from 'bcryptjs';

// Define proper types for bcrypt methods
type BcryptGenSalt = (rounds: number) => Promise<string>;
type BcryptHash = (data: string, salt: string) => Promise<string>;
type BcryptCompare = (data: string, encrypted: string) => Promise<boolean>;

// Cast bcrypt methods to proper types
const genSalt = bcrypt.genSalt as BcryptGenSalt;
const hash = bcrypt.hash as BcryptHash;
const compare = bcrypt.compare as BcryptCompare;

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
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 密码验证方法
UserSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
  return compare(candidatePassword, this.password);
};

// 合并类型
export type UserDocument = User & Document;
