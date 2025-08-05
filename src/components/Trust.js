import React from 'react';

const Trust = () => {
  return (
    <section className="trust-section scroll-reveal">
      <div className="container">
        <div className="trust-grid">
          <div className="trust-item">
            <span className="trust-number">2M+</span>
            <span className="trust-label">Active Users</span>
          </div>
          <div className="trust-item">
            <span className="trust-number">50M+</span>
            <span className="trust-label">Conversations</span>
          </div>
          <div className="trust-item">
            <span className="trust-number">15M+</span>
            <span className="trust-label">Images Analyzed</span>
          </div>
          <div className="trust-item">
            <span className="trust-number">99.9%</span>
            <span className="trust-label">Uptime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
