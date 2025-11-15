export enum PaperStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Paper {
  _id: string;
  title: string;
  authors: string;
  doi: string;
  journal?: string;
  year?: number;
  abstract?: string;
  submitter: string;
  status: PaperStatus;
  submittedAt: string; // 后端返回 ISO 字符串，前端用 string 接收
  reviewer?: string;
  reviewedAt?: string;
}

export interface PaginatedPapers {
  papers: Paper[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}