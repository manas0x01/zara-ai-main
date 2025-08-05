import React from 'react';

const FAQ = () => {
  return (
    <section className="faq scroll-reveal" id="faq">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">Everything you need to know about Zara AI</p>
        <div className="faq-container">
          <div className="faq-item">
            <div className="faq-question">
              <h3>Is Zara AI really free to use?</h3>
              <span className="faq-icon">+</span>
            </div>
            <div className="faq-answer">
              Yes! Zara AI is completely free to use with no hidden costs, subscription fees, or usage limits. We believe advanced AI should be accessible to everyone, so we've made our platform entirely free for all users.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <h3>What types of images can Zara AI analyze?</h3>
              <span className="faq-icon">+</span>
            </div>
            <div className="faq-answer">
              Zara AI can analyze virtually any image format including photos, documents, charts, diagrams, screenshots, artwork, and more. It can extract text, identify objects, understand scenes, analyze data visualizations, and provide contextual insights about visual content.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <h3>How secure are my conversations with Zara AI?</h3>
              <span className="faq-icon">+</span>
            </div>
            <div className="faq-answer">
              Your privacy is our top priority. All conversations are encrypted end-to-end, we don't store personal data or conversation history, and we're fully compliant with international privacy regulations including GDPR and CCPA. Each session is independent and secure.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <h3>Can Zara AI help with professional work?</h3>
              <span className="faq-icon">+</span>
            </div>
            <div className="faq-answer">
              Absolutely! Zara AI is designed to assist with professional tasks including document analysis, email drafting, presentation creation, data interpretation, research assistance, technical problem-solving, and strategic planning. Many professionals use it daily to enhance productivity.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <h3>What languages does Zara AI support?</h3>
              <span className="faq-icon">+</span>
            </div>
            <div className="faq-answer">
              Zara AI supports over 100 languages with native-level fluency. It can translate between languages, maintain conversations in multiple languages, and provide culturally appropriate responses while preserving context and meaning.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <h3>Is there a limit to how much I can use Zara AI?</h3>
              <span className="faq-icon">+</span>
            </div>
            <div className="faq-answer">
              No usage limits! You can have unlimited conversations, upload unlimited images, and use all features without restrictions. We believe in providing unrestricted access to AI capabilities for everyone.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <h3>Can Zara AI remember previous conversations?</h3>
              <span className="faq-icon">+</span>
            </div>
            <div className="faq-answer">
              Within a single session, Zara AI maintains context and remembers the conversation flow. However, for privacy reasons, conversations are not stored between sessions. Each new visit starts fresh, ensuring your privacy while maintaining intelligent context during your current conversation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
