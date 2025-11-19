import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <nav className="nav">
        <NavLink to="/" className="nav-brand">
          <span className="brand-icon">🔌</span>
          <h2>AllAPIs</h2>
        </NavLink>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="nav-icon">🏠</span>
            Home
          </NavLink>
          <NavLink 
            to="/space-images" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="nav-icon">🛰️</span>
            Space Images
          </NavLink>

          <NavLink 
            to="/dogs" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="nav-icon">🐶</span>
            Dogs
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Header;