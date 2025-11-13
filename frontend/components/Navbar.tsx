import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">SPEED</Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/submit" className="navbar-link">Submit Paper</Link>
          <Link to="/review" className="navbar-link">Review Queue</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;