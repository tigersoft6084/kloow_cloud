import React from 'react';
import '../../../assets/css/landing.css';
import categoryItemBg from '../../../assets/images/landing/category_item_bg.png';
import solutionBg from '../../../assets/images/landing/solution_bg.png';
import YouTubeSvg from '../../../assets/images/landing/YouTube.svg';
import GoogleSvg from '../../../assets/images/landing/Google.svg';
import FacebookSvg from '../../../assets/images/landing/Facebook.svg';
import TikTokSvg from '../../../assets/images/landing/TikTok.svg';
import AmazonSvg from '../../../assets/images/landing/Amazon.svg';
import LibreSvg from '../../../assets/images/landing/Libre.svg';
import ShopifySvg from '../../../assets/images/landing/Shopify.svg';
import WalmartSvg from '../../../assets/images/landing/Walmart.svg';
import InstagramSvg from '../../../assets/images/landing/Instagram.svg';
import LinkedInSvg from '../../../assets/images/landing/LinkedIn.svg';
import TwitterSvg from '../../../assets/images/landing/Twitter.svg';
import RedditSvg from '../../../assets/images/landing/Reddit.svg';

const SolutionCategories = () => {
  return (
    <section className="solution-categories">
      <div className="solution-categories-container">
        <div
          className="solution-categories-header"
          style={{
            width: '100%'
          }}
        >
          <div className="solution-categories-bg">
            <img src={solutionBg} alt="solution-bg" className="solution-categories-bg-image" />
          </div>
          <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)' }}>
            <h2 className="solution-categories-title">Solutions for Every Digital Challenge</h2>
            <p className="solution-categories-description">
              No matter your role—agency lead, store manager, or social strategist—Kloow streamlines complex tasks and keeps each project
              isolated, private, and easy to scale.
            </p>
          </div>
        </div>

        <div className="solution-cards">
          {/* Marketing Agencies Card */}
          <div
            className="solution-card"
            style={{
              backgroundImage: `url(${categoryItemBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="solution-card-icons">
              <div className="solution-icon">
                <img src={YouTubeSvg} alt="YouTube" className="solution-icon-image" />
              </div>
              <div className="solution-icon">
                <img src={GoogleSvg} alt="Google" className="solution-icon-image" />
              </div>
              <div className="solution-icon">
                <img src={FacebookSvg} alt="Facebook" className="solution-icon-image" />
              </div>
              <div className="solution-icon">
                <img src={TikTokSvg} alt="TikTok" className="solution-icon-image" />
              </div>
            </div>
            <h3 className="solution-card-title">For Marketing Agencies</h3>
            <p className="solution-card-description">
              Manage all your clients&apos; social media and advertising accounts from a central hub. Launch campaigns on Facebook, Google,
              and TikTok for different clients simultaneously without the risk of blocks from crossed logins.
            </p>
            <button className="solution-card-cta">Learn More →</button>
          </div>

          {/* E-commerce Managers Card */}
          <div
            className="solution-card"
            style={{
              backgroundImage: `url(${categoryItemBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="solution-card-icons">
              <div className="solution-icon">
                <img src={AmazonSvg} alt="Amazon" className="solution-icon-image" />
              </div>
              <div className="solution-icon">
                <img src={LibreSvg} alt="Mercado Libre" className="solution-icon-image" />
              </div>
              <div className="solution-icon">
                <img src={ShopifySvg} alt="Shopify" className="solution-icon-image" />
              </div>
              <div className="solution-icon">
                <img src={WalmartSvg} alt="Walmart" className="solution-icon-image" />
              </div>
            </div>
            <h3 className="solution-card-title">For E-commerce Managers</h3>
            <p className="solution-card-description">
              Administer multiple online stores on platforms like Amazon, Shopify, or Mercado Libre. Control inventory, process orders, and
              manage customer support for each store from its own secure, isolated environment.
            </p>
            <button className="solution-card-cta">Learn More →</button>
          </div>

          {/* Social Media Teams Card */}
          <div
            className="solution-card"
            style={{
              backgroundImage: `url(${categoryItemBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="solution-card-icons">
              <div className="solution-icon">
                <img src={InstagramSvg} alt="Instagram" className="solution-icon-image" />
              </div>
              <div className="solution-icon">
                <img src={LinkedInSvg} alt="LinkedIn" className="solution-icon-image" />
              </div>
              <div className="solution-icon">
                <img src={TwitterSvg} alt="Twitter" className="solution-icon-image" />
              </div>
              <div className="solution-icon">
                <img src={RedditSvg} alt="Reddit" className="solution-icon-image" />
              </div>
            </div>
            <h3 className="solution-card-title">For Social Media Teams</h3>
            <p className="solution-card-description">
              Allow multiple community managers to work on different accounts on the same platform (e.g., Instagram, LinkedIn) at the same
              time. Assign specific profiles to each team member and collaborate efficiently.
            </p>
            <button className="solution-card-cta">Learn More →</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionCategories;
