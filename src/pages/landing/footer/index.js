import React from 'react';
import footerBg from '../../../assets/images/landing/footer.png';
import logoSvg from '../../../assets/images/landing/logo.svg';
import '../../../assets/css/landing.css';

const Footer = () => {
  return (
    <footer className="footer">
      <img src={footerBg} alt="" aria-hidden="true" className="footer-bg" />
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-header">
              <img src={logoSvg} alt="Kloow" className="footer-brand-logo" />
              <span className="footer-brand-name">Kloow</span>
            </div>
            <p className="footer-brand-desc">Kloow - Centralize your digital operations with security and efficiency.</p>
          </div>

          <div className="footer-nav">
            <nav className="footer-nav-section">
              <div className="footer-nav-heading">Product</div>
              <ul className="footer-nav-list">
                <li>
                  <a href="#features" className="footer-nav-link">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="footer-nav-link">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#download" className="footer-nav-link">
                    Download
                  </a>
                </li>
              </ul>
            </nav>

            <nav className="footer-nav-section">
              <div className="footer-nav-heading">Company</div>
              <ul className="footer-nav-list">
                <li>
                  <a href="#about" className="footer-nav-link">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#blog" className="footer-nav-link">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#careers" className="footer-nav-link">
                    Careers
                  </a>
                </li>
              </ul>
            </nav>

            <nav className="footer-nav-section">
              <div className="footer-nav-heading">Legal</div>
              <ul className="footer-nav-list">
                <li>
                  <a href="#privacy" className="footer-nav-link">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="footer-nav-link">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div>
          <p className="footer-copyright">© 2025 KLOOW LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
