import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Code2 } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <Code2 className="brand-icon" size={28} />
          <span>Automated Code Reviewer</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Review Code</Link>
          <Link to="/history" className={`nav-link ${isActive('/history')}`}>Review History</Link>
          <Link to="/analytics" className={`nav-link ${isActive('/analytics')}`}>Analytics</Link>
        </div>

        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
