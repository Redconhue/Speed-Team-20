import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();

  const getLinkClass = (path: string) => 
    `navbar-link ${location.pathname === path ? 'active' : ''}`;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">文献审核系统</Link>
        <div className="navbar-links">
          <Link to="/" className={getLinkClass('/')}>首页</Link>
          <Link to="/submit" className={getLinkClass('/submit')}>提交文献</Link>
          <Link to="/review" className={getLinkClass('/review')}>审核队列</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;