import React from 'react';
import Hero from './hero';
import Footer from './footer';
import '../../assets/css/landing.css';
import WorkflowFeatures from './workflows';
import Solutions from './solutions';
import FAQSection from './faq';
import PricingPlans from './pricing';
import Testimonials from './testimonials';
import Header from './header';

const Landing = () => {
  return (
    <div className="landing-page" style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#010511', overflowX: 'hidden' }}>
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
        <div style={{ width: '100%', margin: '0 auto' }}>
          <Header />
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
