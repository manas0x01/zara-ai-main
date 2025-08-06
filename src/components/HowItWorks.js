import React from 'react';

const HowItWorks = () => {
  return (
    <section className="how-it-works scroll-reveal" id="how-it-works">
      <div className="container">
        <h2 className="section-title">Simple, Powerful, Intuitive</h2>
        <p className="section-subtitle">Getting started with Myra AI is as easy as having a conversation</p>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Start Chatting</h3>
            <p>Simply type your question, upload an image, or start a conversation. No registration required - just begin talking to Myra AI instantly.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Get Intelligent Responses</h3>
            <p>Myra AI processes your input using advanced language models and computer vision to provide accurate, contextual, and helpful responses.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Continue the Conversation</h3>
            <p>Build on previous responses, ask follow-up questions, and explore topics in depth through natural, flowing conversations that remember context.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
