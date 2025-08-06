import React from 'react';

const Newsletter = () => {
  return (
    <section className="newsletter scroll-reveal">
      <div className="newsletter-content">
        <h2>Stay Updated with Myra AI</h2>
        <p>Get the latest updates on new features, AI insights, and tips to maximize your Myra AI experience</p>
        <form className="newsletter-form">
          <input type="email" className="newsletter-input" placeholder="Enter your email address" required />
          <button type="submit" className="newsletter-button">Subscribe</button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
