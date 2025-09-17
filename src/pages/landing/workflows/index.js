import React from 'react';
import '../../../assets/css/landing.css';
import isolatedSvg from '../../../assets/images/landing/isolated.svg';
import secureTeamSvg from '../../../assets/images/landing/secure_team.svg';
import repetitiveSvg from '../../../assets/images/landing/repetitive.svg';
import proxySvg from '../../../assets/images/landing/proxy.svg';

const WorkflowFeatures = () => {
  return (
    <section className="workflow-features">
      <div className="workflow-features-container">
        {/* Header Section */}
        <div className="workflow-features-header">
          <h2 className="workflow-features-title">
            Built to Power Serious <span className="workflow-features-title-highlight">Workflows</span>
          </h2>
          <p className="workflow-features-description">
            Kloow combines security, automation, and collaboration tools so your team can manage multiple clients and projects without
            friction—no matter how complex your operations become.
          </p>
        </div>

        {/* Features Grid */}
        <div className="workflow-features-grid">
          {/* Feature 1: Isolated Browser Environments */}
          <div className="workflow-feature-card">
            <div className="workflow-feature-icon">
              <img src={isolatedSvg} alt="Isolated Browser Environments" width="46" height="46" />
            </div>
            <h3 className="workflow-feature-title">Isolated Browser Environments</h3>
            <p className="workflow-feature-description">
              Each profile in Kloow acts as an independent virtual device, with its own storage, cookies, and cache. Prevent data crossover
              between accounts and ensure maximum privacy and security for every client.
            </p>
          </div>

          {/* Feature 2: Secure Team Collaboration */}
          <div className="workflow-feature-card">
            <div className="workflow-feature-icon">
              <img src={secureTeamSvg} alt="Secure Team Collaboration" width="46" height="46" />
            </div>
            <h3 className="workflow-feature-title">Secure Team Collaboration</h3>
            <p className="workflow-feature-description">
              Invite team members, assign roles, and manage permissions for each profile without sharing passwords. Every action is logged,
              offering full control and seamless collaboration.
            </p>
          </div>

          {/* Feature 3: Repetitive Task Optimization */}
          <div className="workflow-feature-card">
            <div className="workflow-feature-icon">
              <img src={repetitiveSvg} alt="Repetitive Task Optimization" width="46" height="46" />
            </div>
            <h3 className="workflow-feature-title">Repetitive Task Optimization</h3>
            <p className="workflow-feature-description">
              Automate simple actions like logging in, filling out forms, and other routine tasks. Spend less time on management and more
              time on strategy.
            </p>
          </div>

          {/* Feature 4: Integrated Proxy Management */}
          <div className="workflow-feature-card">
            <div className="workflow-feature-icon">
              <img src={proxySvg} alt="Integrated Proxy Management" width="46" height="46" />
            </div>
            <h3 className="workflow-feature-title">Integrated Proxy Management</h3>
            <p className="workflow-feature-description">
              Easily assign and manage proxies for your profiles to analyze markets and campaigns from different geographic locations. Ideal
              for agencies with international clients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowFeatures;
