import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, PaperStatus } from '../types/paper';
import './PaperCard.css';

interface PaperCardProps {
  paper: Paper;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper }) => {
  const statusStyle = {
    [PaperStatus.PENDING]: 'status-pending',
    [PaperStatus.APPROVED]: 'status-approved',
    [PaperStatus.REJECTED]: 'status-rejected',
  };

  const statusText = {
    [PaperStatus.PENDING]: '待审核',
    [PaperStatus.APPROVED]: '已通过',
    [PaperStatus.REJECTED]: '已驳回',
  };

  return (
    <div className="paper-card">
      <div className="paper-card-header">
        <h3 className="paper-title">
          <Link to={`/papers/${paper._id}`}>{paper.title}</Link>
        </h3>
        <span className={`status-tag ${statusStyle[paper.status]}`}>
          {statusText[paper.status]}
        </span>
      </div>
      <div className="paper-card-body">
        <p className="paper-authors">作者：{paper.authors}</p>
        {paper.journal && <p className="paper-journal">期刊：{paper.journal}</p>}
        {paper.year && <p className="paper-year">发表年份：{paper.year}</p>}
        <p className="paper-submitter">提交者：{paper.submitter}</p>
        <p className="paper-submit-time">
          提交时间：{new Date(paper.submittedAt).toLocaleString()}
        </p>
      </div>
      <div className="paper-card-footer">
        <Link to={`/papers/${paper._id}`} className="view-detail-btn">查看详情</Link>
      </div>
    </div>
  );
};

export default PaperCard;