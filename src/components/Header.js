import React, { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import apiService from '../services/api';
import './Auth.css';

const Header = () => {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = apiService.getCurrentUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      setShowUserMenu(false);
      // Optionally refresh the page or redirect
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <>
      <nav>
        <div className="nav-content">
          <div className="logo">Zara AI</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#use-cases">Use Cases</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#demo">Demo</a></li>
            <li><a href="#testimonials">Reviews</a></li>
          </ul>
          
          {user ? (
            <div className="user-menu">
              <button className="user-menu-trigger" onClick={toggleUserMenu}>
                <span className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.firstName} />
                  ) : (
                    <span className="user-initial">
                      {user.firstName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
                <span className="user-name">
                  {user.firstName}
                </span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-name-full">{user.firstName} {user.lastName}</div>
                    <div className="user-email">{user.email}</div>
                    {!user.isVerified && (
                      <div className="verification-status">
                        <span className="unverified-badge">Email not verified</span>
                      </div>
                    )}
                  </div>
                  <div className="user-menu-items">
                    <a href="#profile" className="user-menu-item">
                      <span>👤</span> Profile
                    </a>
                    <a href="#settings" className="user-menu-item">
                      <span>⚙️</span> Settings
                    </a>
                    <a href="#dashboard" className="user-menu-item">
                      <span>📊</span> Dashboard
                    </a>
                    <div className="user-menu-divider"></div>
                    <button onClick={handleLogout} className="user-menu-item logout-item">
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="signup-btn cta-button"
                onClick={() => openAuthModal('signup')}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.mode}
      />
    </>
  );
};

export default Header;
