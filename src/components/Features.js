import React from 'react';

const Features = () => {
  return (
    <section className="features scroll-reveal" id="features">
      <div className="container">
        <h2 className="section-title">Revolutionary AI Capabilities</h2>
        <p className="section-subtitle">Discover what makes Zara AI the most advanced and intuitive conversational AI platform available today</p>
        <div className="features-grid">
          <div className="feature-card floating">
            <div className="feature-icon">🧠</div>
            <h3>Advanced Natural Language</h3>
            <p>Engage in human-like conversations with sophisticated context awareness. Zara AI understands nuance, maintains coherent dialogue across complex topics, and provides thoughtful responses that feel genuinely conversational and personalized.</p>
          </div>
          <div className="feature-card floating" style={{animationDelay: '0.2s'}}>
            <div className="feature-icon">👁️</div>
            <h3>Intelligent Image Analysis</h3>
            <p>Upload any image for detailed analysis including object recognition, text extraction, scene understanding, and contextual insights. From photographs to documents, charts to artwork - Zara sees and comprehends visual content with remarkable accuracy.</p>
          </div>
          <div className="feature-card floating" style={{animationDelay: '0.4s'}}>
            <div className="feature-icon">✨</div>
            <h3>Creative Intelligence</h3>
            <p>Transform ideas into reality with advanced creative assistance. Whether it's writing, brainstorming, problem-solving, or artistic projects, Zara AI adapts to your creative style and helps bring your vision to life with innovative suggestions.</p>
          </div>
          <div className="feature-card floating" style={{animationDelay: '0.6s'}}>
            <div className="feature-icon">🌍</div>
            <h3>Multilingual Mastery</h3>
            <p>Communicate seamlessly in over 100 languages with native-level fluency. Zara AI provides accurate translations, cultural context, and maintains conversation flow across language barriers, making global communication effortless.</p>
          </div>
          <div className="feature-card floating" style={{animationDelay: '0.8s'}}>
            <div className="feature-icon">⚡</div>
            <h3>Lightning-Fast Processing</h3>
            <p>Experience instant responses powered by cutting-edge AI infrastructure. Zara AI processes complex queries, analyzes large images, and generates detailed responses in milliseconds, ensuring smooth, uninterrupted conversations.</p>
          </div>
          <div className="feature-card floating" style={{animationDelay: '1s'}}>
            <div className="feature-icon">🛡️</div>
            <h3>Privacy-First Design</h3>
            <p>Your conversations remain completely private and secure. Zara AI employs enterprise-grade encryption, doesn't store personal data, and gives you full control over your information with transparent privacy practices.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
