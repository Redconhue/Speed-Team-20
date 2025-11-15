import axios from 'axios';
import { Paper, PaginatedPapers, PaperStatus } from '../types/paper';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：携带登录 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const paperApi = {
  // 分页+多条件查询文献（参数 filters 类型明确）
  getPapers: async (
    page = 1,
    limit = 10,
    filters?: {
      status?: PaperStatus; // 确保为 PaperStatus 类型
      keyword?: string;
      startYear?: number;
      endYear?: number;
      submitter?: string;
    }
  ): Promise<PaginatedPapers> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.status) params.append('status', filters.status); // 枚举值直接作为字符串传递（后端兼容）
    if (filters?.keyword) params.append('keyword', filters.keyword);
    if (filters?.startYear) params.append('start', filters.startYear.toString());
    if (filters?.endYear) params.append('end', filters.endYear.toString());
    if (filters?.submitter) params.append('submitter', filters.submitter);

    const res = await api.get<PaginatedPapers>(`/papers?${params.toString()}`);
    return res.data;
  },

  // 获取单篇文献详情
  getPaperById: async (id: string): Promise<Paper> => {
    const res = await api.get<Paper>(`/papers/${id}`);
    return res.data;
  },
};