import React from 'react';

const InteractiveDemo = () => {
  return (
    <section className="interactive-demo scroll-reveal" id="demo">
      <div className="container">
        <h2 className="section-title">Try Zara AI Now</h2>
        <p className="section-subtitle">Experience the power of advanced AI conversation - completely free</p>
        <div className="demo-container">
          <div className="chat-interface" id="chatInterface">
            <div className="chat-message ai-message">
              <div className="message-bubble">
                👋 Hello! I'm Zara AI, your intelligent companion. I can help with conversations, analyze images, assist with creative projects, answer questions, and much more. What would you like to explore together?
              </div>
            </div>
          </div>
          <div className="demo-input-area">
            <input type="text" className="demo-input" id="demoInput" placeholder="Ask me anything or describe what you need help with..." />
            <button className="demo-send" id="demoSend">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
