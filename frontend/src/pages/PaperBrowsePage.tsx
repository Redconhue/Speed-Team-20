import React, { useState, useEffect } from 'react';
import { Paper, PaperStatus } from '../types/paper'; // 导入 PaperStatus 枚举
import { paperApi } from '../services/paperApi';
import PaperCard from '../components/PaperCard';
import PaperFilter from '../components/PaperFilter';
import Pagination from '../components/Pagination';
import Navbar from '../components/Navbar';
import './PaperBrowsePage.css';

const PaperBrowsePage: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // 关键修正：将 status 类型指定为 PaperStatus（而非 string）
  const [filters, setFilters] = useState<{
    status?: PaperStatus; // 改为 PaperStatus 枚举类型
    keyword?: string;
    startYear?: number;
    endYear?: number;
    submitter?: string;
  }>({});

  // 加载文献列表
  const fetchPapers = async () => {
    setLoading(true);
    try {
      const data = await paperApi.getPapers(
        pagination.page,
        pagination.limit,
        filters // 现在类型匹配，无报错
      );
      setPapers(data.papers);
      setPagination(prev => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
      setError(null);
    } catch (err) {
      setError('加载文献失败，请重试');
      console.error('加载失败：', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载 + 筛选/分页变化时重新加载
  useEffect(() => {
    fetchPapers();
  }, [pagination.page, pagination.limit, filters]);

  // 处理筛选变化（参数类型同步修正）
  const handleFilterChange = (newFilters: {
    status?: PaperStatus; // 同步改为 PaperStatus
    keyword?: string;
    startYear?: number;
    endYear?: number;
    submitter?: string;
  }) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // 筛选重置到第一页
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="paper-browse-page">
      <Navbar />
      <div className="container">
        <h1 className="page-title">文献浏览</h1>

        {/* 筛选组件：initialFilters 类型现在匹配 */}
        <PaperFilter onFilterChange={handleFilterChange} initialFilters={filters} />

        {/* 状态提示 */}
        {loading ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : papers.length === 0 ? (
          <div className="no-papers">暂无符合条件的文献</div>
        ) : (
          <>
            {/* 文献列表 */}
            <div className="papers-list">
              {papers.map(paper => (
                <PaperCard key={paper._id} paper={paper} />
              ))}
            </div>

            {/* 分页 */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PaperBrowsePage;