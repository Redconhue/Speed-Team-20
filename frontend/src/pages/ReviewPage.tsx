import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewPage.css';

interface Paper {
  _id: string;
  title: string;
  authors: string;
  doi: string;
  journal?: string;
  year?: number;
  submitter: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ReviewerData {
  reviewer: string;
}

const ReviewPage: React.FC = () => {
  const [pendingPapers, setPendingPapers] = useState<Paper[]>([]);
  const [reviewerData, setReviewerData] = useState<ReviewerData>({ reviewer: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 获取待审核文献
  const fetchPendingPapers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/papers/pending');
      setPendingPapers(response.data);
      setError('');
    } catch (err: any) {
      setError('获取待审核文献失败，请重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPapers();
  }, []);

  // 审核操作（通过/拒绝）
  const handleReviewAction = async (id: string, action: 'approve' | 'reject') => {
    if (!reviewerData.reviewer.trim()) {
      alert('请输入审核者姓名');
      return;
    }

    setActionLoading(id);
    try {
      await axios.put(`http://localhost:3001/api/papers/${id}/${action}`, reviewerData);
      // 重新获取列表
      fetchPendingPapers();
    } catch (err: any) {
      alert(`操作失败：${err.response?.data?.message || '服务器错误'}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="review-container">
      <h1>文献审核队列</h1>

      <div className="reviewer-info">
        <label htmlFor="reviewer">审核者姓名 <span className="required">*</span></label>
        <input
          type="text"
          id="reviewer"
          value={reviewerData.reviewer}
          onChange={(e) => setReviewerData({ reviewer: e.target.value })}
          placeholder="请输入您的姓名"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {pendingPapers.length === 0 ? (
        <div className="empty-state">暂无待审核文献</div>
      ) : (
        <div className="papers-list">
          {pendingPapers.map((paper) => (
            <div key={paper._id} className="paper-card">
              <div className="paper-header">
                <h3>{paper.title}</h3>
                <span className="status-badge">待审核</span>
              </div>

              <div className="paper-details">
                <p><strong>作者：</strong>{paper.authors}</p>
                <p><strong>DOI：</strong>{paper.doi}</p>
                {paper.journal && <p><strong>期刊：</strong>{paper.journal}</p>}
                {paper.year && <p><strong>年份：</strong>{paper.year}</p>}
                <p><strong>提交者：</strong>{paper.submitter}</p>
                <p><strong>提交时间：</strong>{new Date(paper.submittedAt).toLocaleString()}</p>
              </div>

              <div className="paper-actions">
                <button
                  className="btn approve-btn"
                  onClick={() => handleReviewAction(paper._id, 'approve')}
                  disabled={actionLoading === paper._id}
                >
                  {actionLoading === paper._id ? '处理中...' : '通过'}
                </button>
                <button
                  className="btn reject-btn"
                  onClick={() => handleReviewAction(paper._id, 'reject')}
                  disabled={actionLoading === paper._id}
                >
                  {actionLoading === paper._id ? '处理中...' : '拒绝'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewPage;