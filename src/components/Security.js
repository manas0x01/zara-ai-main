import React from 'react';

const Security = () => {
  return (
    <section className="security-section scroll-reveal">
      <div className="container">
        <h2 className="section-title">Your Privacy, Our Priority</h2>
        <p className="section-subtitle">Built with enterprise-grade security and privacy-first principles</p>
        <div className="security-grid">
          <div className="security-card">
            <div className="security-icon">🔒</div>
            <h3>End-to-End Encryption</h3>
            <p>All conversations are encrypted using military-grade security protocols to ensure your data remains completely private and secure.</p>
          </div>
          <div className="security-card">
            <div className="security-icon">🚫</div>
            <h3>No Data Storage</h3>
            <p>We don't store your personal conversations or images. Each session is independent, ensuring maximum privacy and data protection.</p>
          </div>
          <div className="security-card">
            <div className="security-icon">🛡️</div>
            <h3>GDPR Compliant</h3>
            <p>Fully compliant with international privacy regulations including GDPR, CCPA, and other data protection standards worldwide.</p>
          </div>
          <div className="security-card">
            <div className="security-icon">✅</div>
            <h3>Transparent Practices</h3>
            <p>Clear, honest privacy policies with no hidden clauses. You maintain full control over your data and can review our practices anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
