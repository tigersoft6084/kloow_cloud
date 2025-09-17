import React from 'react';
import '../../../assets/css/landing.css';
import johnRayAvatar from '../../../assets/images/landing/john_ray.png';
import marcusRodriguezAvatar from '../../../assets/images/landing/marcus_rodriguez.png';
import elenaKowalskiAvatar from '../../../assets/images/landing/elena_kowalski.png';
import testimonialsBg from '../../../assets/images/landing/testimonials_bg.png';

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        'This browser saved our entire ad operation. We went from losing 3-4 Facebook accounts per week to zero bans in 6 months. The fingerprint protection is unmatched.',
      author: 'John Ray',
      title: 'Growth Marketing Manager',
      avatar: johnRayAvatar
    },
    {
      quote:
        'The team collaboration features are incredible. We manage 200+ profiles across 15 team members without any conflicts. The proxy integration is seamless.',
      author: 'Marcus Rodriguez',
      title: 'Affiliate Marketing Director',
      avatar: marcusRodriguezAvatar
    },
    {
      quote:
        'Finally, a browser that takes privacy seriously. The enterprise security features meet all our compliance requirements. Our clients love the transparency.',
      author: 'Elena Kowalski',
      title: 'Privacy Consultant',
      avatar: elenaKowalskiAvatar
    }
  ];

  return (
    <section
      className="testimonials-section"
      style={{
        backgroundImage: `url(${testimonialsBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">Trusted by 10,000+ Privacy Professionals</h2>
          <p className="testimonials-subtitle">
            Join thousands of marketers, agencies, and privacy experts who rely on AntiTrace every day.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <blockquote className="testimonial-quote">&quot;{testimonial.quote}&quot;</blockquote>
              </div>

              <div className="testimonial-author">
                <img src={testimonial.avatar} alt={testimonial.author} className="testimonial-avatar" />
                <div className="testimonial-author-info">
                  <h4 className="testimonial-author-name">{testimonial.author}</h4>
                  <p className="testimonial-author-title">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
