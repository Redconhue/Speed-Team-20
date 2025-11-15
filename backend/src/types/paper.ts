// src/types/paper.ts
// 枚举：既是类型也是值，需要单独导出（不使用 type）
export enum PaperStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// 接口：纯类型，后续用 export type 导出
export interface Paper {
  title: string;
  authors: string;
  doi: string;
  journal?: string;
  year?: number;
  abstract?: string;
  submitter: string;
  status: PaperStatus;
  submittedAt: Date;
  reviewer?: string;
  reviewedAt?: Date;
}

export interface PaginatedPapers {
  papers: Paper[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}