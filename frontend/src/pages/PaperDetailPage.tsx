import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Paper, PaperStatus } from '../types/paper';
import { paperApi } from '../services/paperApi';
import Navbar from '../components/Navbar';
import './PaperDetailPage.css';

const PaperDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaperDetail = async () => {
    if (!id) {
      setError('文献ID不存在');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await paperApi.getPaperById(id);
      setPaper(data);
      setError(null);
    } catch (err) {
      setError('加载文献详情失败');
      console.error('详情加载失败：', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaperDetail();
  }, [id]);

  // 状态样式映射
  const getStatusClass = (status: PaperStatus) => {
    switch (status) {
      case PaperStatus.PENDING: return 'status-pending';
      case PaperStatus.APPROVED: return 'status-approved';
      case PaperStatus.REJECTED: return 'status-rejected';
      default: return '';
    }
  };

  const getStatusText = (status: PaperStatus) => {
    switch (status) {
      case PaperStatus.PENDING: return '待审核';
      case PaperStatus.APPROVED: return '已通过';
      case PaperStatus.REJECTED: return '已驳回';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="paper-detail-page">
        <Navbar />
        <div className="container loading">加载中...</div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="paper-detail-page">
        <Navbar />
        <div className="container error">
          {error}
          <button className="back-btn" onClick={() => navigate('/papers')}>返回文献列表</button>
        </div>
      </div>
    );
  }

  return (
    <div className="paper-detail-page">
      <Navbar />
      <div className="container">
        <Link to="/papers" className="back-link">← 返回文献列表</Link>

        <div className="paper-detail-header">
          <h1 className="paper-title">{paper.title}</h1>
          <span className={`status-tag ${getStatusClass(paper.status)}`}>
            {getStatusText(paper.status)}
          </span>
        </div>

        <div className="paper-detail-content">
          <div className="paper-meta">
            <div className="meta-item">
              <span className="meta-label">作者：</span>
              <span className="meta-value">{paper.authors}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">DOI：</span>
              <span className="meta-value">{paper.doi}</span>
            </div>
            {paper.journal && (
              <div className="meta-item">
                <span className="meta-label">期刊：</span>
                <span className="meta-value">{paper.journal}</span>
              </div>
            )}
            {paper.year && (
              <div className="meta-item">
                <span className="meta-label">发表年份：</span>
                <span className="meta-value">{paper.year}</span>
              </div>
            )}
            <div className="meta-item">
              <span className="meta-label">提交者：</span>
              <span className="meta-value">{paper.submitter}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">提交时间：</span>
              <span className="meta-value">{new Date(paper.submittedAt).toLocaleString()}</span>
            </div>
            {paper.reviewer && (
              <div className="meta-item">
                <span className="meta-label">审核人：</span>
                <span className="meta-value">{paper.reviewer}</span>
              </div>
            )}
            {paper.reviewedAt && (
              <div className="meta-item">
                <span className="meta-label">审核时间：</span>
                <span className="meta-value">{new Date(paper.reviewedAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="paper-abstract">
            <h3>摘要</h3>
            <p>{paper.abstract || '无摘要信息'}</p>
          </div>

          <div className="paper-actions">
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn doi-btn"
            >
              访问DOI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperDetailPage;