import React from 'react';
import '../../../assets/css/landing.css';
import pricingBg from '../../../assets/images/landing/pricing_bg.png';

const PricingTable = () => {
  const pricingPlans = [
    {
      name: 'PROFESSIONAL',
      price: '$29',
      period: '/month',
      description: 'For Freelancers and Consultants',
      features: ['10 Browser Profiles', '1 User', 'Email Support', 'Basic Automation']
    },
    {
      name: 'TEAM',
      price: '$29',
      period: '/month',
      description: 'For Growing teams',
      features: ['100 Browser Profiles', '5 Users', 'Collaboration Features', 'Priority Support', 'Advanced Automation']
    },
    {
      name: 'AGENCY',
      price: '$29',
      period: '/month',
      description: 'For The complete solution for agencies',
      features: ['Unlimited Browser Profiles', 'Unlimited Users', 'Advanced Automation', 'Dedicated Account Manager', 'Custom Integrations']
    }
  ];

  return (
    <section
      className="pricing-table"
      style={{
        backgroundImage: `url(${pricingBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="pricing-container">
        <div className="pricing-header">
          <h2 className="pricing-title">Plans That Grow With You</h2>
          <p className="pricing-subtitle">Choose the perfect plan for your needs. All plans include a 14-day free trial.</p>
        </div>

        <div className="pricing-plans">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="pricing-card">
              <div className="pricing-card-header">
                <h3 className="pricing-plan-name">{plan.name}</h3>
                <div className="pricing-price">
                  <span className="pricing-amount">{plan.price}</span>
                  <span className="pricing-period">{plan.period}</span>
                </div>
                <p className="pricing-description">{plan.description}</p>
              </div>

              <div className="pricing-features">
                <ul className="pricing-feature-list">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="pricing-feature-item">
                      <div className="pricing-feature-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
                          <circle cx="12" cy="12" r="12" fill="#6B2AE8" />
                          <path
                            d="M7.2 12.0 L10.6 15.4 L16.8 9.2"
                            fill="none"
                            stroke="#0B0612"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="pricing-feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pricing-cta">
                <button className="pricing-button">Get Started</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTable;
