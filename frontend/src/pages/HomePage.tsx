import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <div className="home-banner">
        <h1>文献提交与审核系统</h1>
        <p>便捷提交文献，高效审核管理</p>
        <div className="home-buttons">
          <Link to="/submit" className="btn primary-btn">提交文献</Link>
          <Link to="/review" className="btn secondary-btn">进入审核</Link>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <h3>简单易用</h3>
          <p>支持手动输入或BibTeX文件上传，快速提交文献信息</p>
        </div>
        <div className="feature-card">
          <h3>智能验证</h3>
          <p>自动校验DOI格式、必填项，确保数据准确性</p>
        </div>
        <div className="feature-card">
          <h3>高效审核</h3>
          <p>审核者快速查看待审核列表，一键通过/拒绝</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;