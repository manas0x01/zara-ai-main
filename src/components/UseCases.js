import React from 'react';

const UseCases = () => {
  return (
    <section className="use-cases scroll-reveal" id="use-cases">
      <div className="container">
        <h2 className="section-title">Endless Possibilities</h2>
        <p className="section-subtitle">Discover how Myra AI can transform your daily tasks and unlock new creative potential</p>
        <div className="use-cases-grid">
          <div className="use-case-card">
            <span className="use-case-icon">📚</span>
            <h3>Education & Learning</h3>
            <p>Get personalized tutoring, homework help, research assistance, and detailed explanations on any topic. Perfect for students, educators, and lifelong learners.</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">💼</span>
            <h3>Business & Productivity</h3>
            <p>Draft emails, create presentations, analyze documents, brainstorm strategies, and streamline workflows. Boost your professional productivity effortlessly.</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">🎨</span>
            <h3>Creative Projects</h3>
            <p>Generate ideas, write stories, create content, develop concepts, and overcome creative blocks. Your AI creative partner for any artistic endeavor.</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">🔍</span>
            <h3>Research & Analysis</h3>
            <p>Analyze complex information, summarize documents, extract insights, and conduct thorough research on any topic with accuracy and depth.</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">🏠</span>
            <h3>Personal Assistant</h3>
            <p>Plan events, organize schedules, get recipe suggestions, travel recommendations, and daily life assistance. Your intelligent personal companion.</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">💻</span>
            <h3>Technical Support</h3>
            <p>Debug code, explain technical concepts, provide programming guidance, and solve complex technical challenges across multiple platforms.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
