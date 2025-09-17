import React, { useState } from 'react';
import '../../../assets/css/landing.css';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqData = [
    {
      question: 'Is it safe to use Kloow?',
      answer:
        'Absolutely. Kloow uses enterprise-grade security measures including end-to-end encryption, secure data storage, and complete isolation between browser profiles. Each profile operates in its own virtual environment, ensuring maximum security and privacy for all your client accounts.'
    },
    {
      question: 'How is Kloow different from chrome profiles?',
      answer:
        'Kloow provides true browser isolation with dedicated virtual environments for each profile, unlike Chrome profiles which share the same browser instance. This means better security, no data leakage between accounts, and the ability to use different proxies and settings for each profile simultaneously.'
    },
    {
      question: 'Do i need technical knowledge to use Kloow?',
      answer:
        'No technical knowledge required! Kloow is designed with a user-friendly interface that makes it easy for anyone to manage multiple browser profiles. Our intuitive dashboard guides you through setup and management, making complex tasks simple.'
    },
    {
      question: 'What kind of support do you offer?',
      answer:
        'We offer comprehensive support including 24/7 chat support, detailed documentation, video tutorials, and email support. Our team is dedicated to helping you get the most out of Kloow with personalized assistance when you need it.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">
            Have Questions? We Have
            <br />
            <span className="faq-title-highlight">Answers.</span>
          </h2>
          <p className="faq-subtitle">Everything you need to know about Kloow.</p>
        </div>

        <div className="faq-content">
          <div className="faq-divider"></div>
          {faqData.map((faq, index) => (
            <div key={index}>
              <div className="faq-item">
                <button
                  className={`faq-question ${openIndex === index ? 'faq-question-open' : ''}`}
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-toggle-icon">{openIndex === index ? '^' : 'v'}</span>
                </button>

                <div className={`faq-answer ${openIndex === index ? 'faq-answer-open' : ''}`}>
                  <div className="faq-answer-content">{faq.answer}</div>
                </div>
              </div>
              {index < faqData.length - 1 && <div className="faq-divider"></div>}
            </div>
          ))}
          <div className="faq-divider"></div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
