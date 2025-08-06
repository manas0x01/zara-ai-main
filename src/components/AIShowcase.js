import React from 'react';

const AIShowcase = () => {
  return (
    <section className="ai-showcase scroll-reveal">
      <div className="container">
        <h2 className="section-title">See Myra AI in Action</h2>
        <div className="showcase-grid">
          <div className="showcase-demo">
            <div className="demo-header">
              <div className="demo-dot"></div>
              <div className="demo-dot"></div>
              <div className="demo-dot"></div>
            </div>
            <div className="demo-content">
              <div className="demo-text">
                {'>'} User: Can you analyze this sales chart and explain the trends?<br /><br />
                {'>'} Myra AI: I can see your Q3 sales data shows a 23% increase over Q2, with particularly strong growth in the mobile segment. The dip in week 8 correlates with the holiday period, which is typical. Your conversion rates improved significantly after the August campaign launch...<br /><br />
                {'>'} User: What recommendations do you have for Q4?<br /><br />
                {'>'} Myra AI: Based on the trends, I recommend focusing on mobile optimization and expanding the successful August campaign strategy...
              </div>
            </div>
          </div>
          <div className="showcase-text">
            <h3>Intelligent Analysis</h3>
            <p>Upload images, documents, or data visualizations and get detailed analysis with actionable insights. Myra AI understands context, identifies patterns, and provides strategic recommendations.</p>
            <ul className="showcase-features">
              <li>Advanced image recognition and analysis</li>
              <li>Document processing and summarization</li>
              <li>Data visualization interpretation</li>
              <li>Strategic insights and recommendations</li>
              <li>Context-aware follow-up conversations</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIShowcase;
