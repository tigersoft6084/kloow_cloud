import React from 'react';
import Header from '../header';
import '../../../assets/css/landing.css';
import bgHero from '../../../assets/images/landing/section1_background.png';

import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div
      className="landing-container"
      style={{
        width: '100%',
        height: '100%',
        margin: '0 auto',
        backgroundImage: `url(${bgHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Header />
      <section className="hero">
        <div
          className="landing-container"
          style={{
            width: '100%',
            height: '100%',
            margin: '0 auto',
            backgroundImage: `url(${bgHero})`,
            backgroundSize: 'contain',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>

        <div className="hero-content">
          <h1 className="hero-title">
            The Command Center for Your
            <br className="br-desktop" />
            <span className="highlight">Digital Operations</span>
          </h1>
          <div className="hero-subtitle">
            Manage multiple client profiles and accounts in completely isolated browser environments. Kloow offers maximum security and
            efficiency for agencies, marketing teams, and e-commerce managers.
          </div>

          <div className="hero-cta">
            <button className="cta-button" onClick={() => navigate('/auth/login')}>
              Start Your 14-Day Free Trial <span className="arrow">→</span>
            </button>
            <div className="credit-note">No credit card required</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
