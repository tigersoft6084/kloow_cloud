import React, { useState } from 'react';
import logoSvg from '../../../assets/images/landing/logo.svg';
import '../../../assets/css/landing.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo and Brand */}
        <div className="brand">
          <img src={logoSvg} alt="Kloow" className="brand-logo" />
          <span className="brand-name">Kloow</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#use-cases">Use Cases</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>

        {/* Action Buttons */}
        <div className="auth-actions">
          <button className="btn btn-ghost">Login</button>
          <button className="btn btn-primary">Get Started</button>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <nav className="nav-mobile">
          <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </a>
          <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>
            Features
          </a>
          <a href="#use-cases" onClick={() => setIsMobileMenuOpen(false)}>
            Use Cases
          </a>
          <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>
            Pricing
          </a>
          <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>
            FAQ
          </a>
        </nav>
        <div className="mobile-auth-actions">
          <button className="btn btn-ghost">Login</button>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
