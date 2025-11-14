import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Speed Team</Link>
        
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/" className="navbar-link">首页</Link>
              <Link to="/submit" className="navbar-link">提交文献</Link>
              <Link to="/review" className="navbar-link">审核队列</Link>
              <span className="navbar-user">欢迎，{user.username}</span>
              <button onClick={handleLogout} className="navbar-logout">退出登录</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">登录</Link>
              <Link to="/register" className="navbar-link navbar-register">注册</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;