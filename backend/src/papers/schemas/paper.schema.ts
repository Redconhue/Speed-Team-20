import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PaperStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
// 关键：必须加 export 关键字
export class Paper extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  authors: string;

  @Prop({ required: true, unique: true, trim: true })
  doi: string;

  @Prop({ trim: true })
  abstract: string;

  @Prop({ trim: true })
  journal: string;

  @Prop()
  year: number;

  @Prop({ required: true, trim: true })
  submitter: string;

  @Prop({ default: PaperStatus.PENDING, enum: PaperStatus })
  status: PaperStatus;

  @Prop({ default: Date.now })
  submittedAt: Date;

  @Prop()
  reviewedAt: Date;

  @Prop({ trim: true })
  reviewer: string;
}

// 关键：必须加 export 关键字
export const PaperSchema = SchemaFactory.createForClass(Paper);
