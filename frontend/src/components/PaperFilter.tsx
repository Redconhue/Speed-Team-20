import React, { useState, useEffect } from 'react';
import { PaperStatus } from '../types/paper'; // 确保导入枚举
import './PaperFilter.css';

interface PaperFilterProps {
  onFilterChange: (filters: {
    status?: PaperStatus; // 明确为 PaperStatus 类型
    keyword?: string;
    startYear?: number;
    endYear?: number;
    submitter?: string;
  }) => void;
  initialFilters?: Partial<{
    status?: PaperStatus; // 同步修正
    keyword?: string;
    startYear?: number;
    endYear?: number;
    submitter?: string;
  }>;
}

const PaperFilter: React.FC<PaperFilterProps> = ({
  onFilterChange,
  initialFilters = {},
}) => {
  // 状态类型同步修正
  const [filters, setFilters] = useState({
    status: initialFilters.status,
    keyword: initialFilters.keyword || '',
    startYear: initialFilters.startYear,
    endYear: initialFilters.endYear,
    submitter: initialFilters.submitter || '',
  });

  useEffect(() => {
    onFilterChange(filters);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'startYear' || name === 'endYear' ? Number(value) : value,
    }));
  };

  // 关键：确保 select 组件的值转换为 PaperStatus 枚举类型
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PaperStatus | ''; // 类型断言为 PaperStatus
    setFilters(prev => ({ ...prev, status: value || undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({
      status: undefined,
      keyword: '',
      startYear: undefined,
      endYear: undefined,
      submitter: '',
    });
    onFilterChange({});
  };

  return (
    <form className="paper-filter-form" onSubmit={handleSubmit}>
      <div className="filter-row">
        <div className="filter-group">
          <label>关键词搜索</label>
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleInputChange}
            placeholder="标题/作者/期刊/摘要"
          />
        </div>
        <div className="filter-group">
          <label>文献状态</label>
          <select
            name="status"
            value={filters.status || ''}
            onChange={handleStatusChange}
          >
            <option value="">全部状态</option>
            <option value={PaperStatus.PENDING}>待审核</option>
            <option value={PaperStatus.APPROVED}>已通过</option>
            <option value={PaperStatus.REJECTED}>已驳回</option>
          </select>
        </div>
      </div>
      <div className="filter-row">
        <div className="filter-group">
          <label>发表年份范围</label>
          <div className="year-range">
            <input
              type="number"
              name="startYear"
              value={filters.startYear || ''}
              onChange={handleInputChange}
              placeholder="开始年份"
              min="1900"
              max={new Date().getFullYear()}
            />
            <span className="range-separator">-</span>
            <input
              type="number"
              name="endYear"
              value={filters.endYear || ''}
              onChange={handleInputChange}
              placeholder="结束年份"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
        </div>
        <div className="filter-group">
          <label>提交者</label>
          <input
            type="text"
            name="submitter"
            value={filters.submitter}
            onChange={handleInputChange}
            placeholder="提交者姓名"
          />
        </div>
      </div>
      <div className="filter-actions">
        <button type="submit" className="filter-btn submit-btn">筛选</button>
        <button type="button" className="filter-btn reset-btn" onClick={handleReset}>重置</button>
      </div>
    </form>
  );
};

export default PaperFilter;