import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Myra AI</h3>
            <p>Your intelligent AI companion for conversations, creativity, and productivity. Experience the future of artificial intelligence with natural, intuitive interactions that understand and adapt to your needs.</p>
            <div className="social-links">
              <a href="https://twitter.com/myraai" className="social-link" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://facebook.com/myraai" className="social-link" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
              <a href="https://linkedin.com/company/myraai" className="social-link" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
              <a href="https://instagram.com/myraai" className="social-link" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://github.com/myraai" className="social-link" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
            </div>
          </div>
          <div className="footer-section"></div>
          <div className="footer-section">
            <h3>Features</h3>
            <a href="#features">Natural Conversations</a>
            <a href="#features">Image Analysis</a>
            <a href="#features">Creative Intelligence</a>
            <a href="#features">Multilingual Support</a>
            <a href="#features">Privacy & Security</a>
          </div>
          <div className="footer-section">
            <h3>Use Cases</h3>
            <a href="#use-cases">Business Productivity</a>
            <a href="#use-cases">Creative Projects</a>
            <a href="#use-cases">Research & Analysis</a>
            <a href="#use-cases">Personal Assistant</a>
            <a href="#use-cases">Technical Support</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Myra AI. All rights reserved. Built with ❤️ for the future of AI interaction.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
