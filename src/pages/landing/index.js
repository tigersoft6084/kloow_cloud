import React from 'react';
// import Header from './header';
import Hero from './hero';
import Footer from './footer';
import '../../assets/css/landing.css';
import WorkflowFeatures from './workflows';
import Solutions from './solutions';
import FAQSection from './faq';
import PricingPlans from './pricing';
import Testimonials from './testimonials';

const Landing = () => {
  return (
    <div className="landing-page" style={{ width: '100vw', height: '100vh', backgroundColor: '#010511' }}>
      <div
        style={{
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#010511'
        }}
      >
        <div style={{ width: '100%', margin: '0 auto', maxWidth: '1440px' }}>
          <Hero />
          <WorkflowFeatures />
          <Solutions />
          <PricingPlans />
          <Testimonials />
          <FAQSection />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Landing;
