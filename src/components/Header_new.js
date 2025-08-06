import React, { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import apiService from '../services/api';
import './Auth.css';

const Header = () => {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = apiService.getCurrentUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode });
    setMobileMenuOpen(false);
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      setShowUserMenu(false);
      setMobileMenuOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={mobileMenuOpen ? 'mobile-menu-open' : ''}>
        <div className="nav-content">
          <div className="logo" onClick={() => scrollToSection('home')}>Zara AI</div>
          
          {/* Desktop Navigation */}
          <ul className="nav-links desktop-only">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
            <li><a href="#use-cases" onClick={(e) => { e.preventDefault(); scrollToSection('use-cases'); }}>Use Cases</a></li>
            <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a></li>
            <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Reviews</a></li>
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="auth-buttons desktop-only">
            {user ? (
              <div className="user-menu">
                <button 
                  className="user-menu-trigger"
                  onClick={toggleUserMenu}
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  <span>{user.name || user.email}</span>
                  <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <a href="#profile" className="dropdown-item">
                      <i className="fas fa-user"></i> Profile
                    </a>
                    <a href="#settings" className="dropdown-item">
                      <i className="fas fa-cog"></i> Settings
                    </a>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  className="login-btn" 
                  onClick={() => openAuthModal('login')}
                >
                  Login
                </button>
                <button 
                  className="signup-btn" 
                  onClick={() => openAuthModal('signup')}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={mobileMenuOpen ? 'active' : ''}></span>
            <span className={mobileMenuOpen ? 'active' : ''}></span>
            <span className={mobileMenuOpen ? 'active' : ''}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="mobile-nav-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
            <li><a href="#use-cases" onClick={(e) => { e.preventDefault(); scrollToSection('use-cases'); }}>Use Cases</a></li>
            <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a></li>
            <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Reviews</a></li>
          </ul>
          
          <div className="mobile-auth-buttons">
            {user ? (
              <div className="mobile-user-menu">
                <div className="mobile-user-info">
                  <span>{user.name || user.email}</span>
                </div>
                <button className="mobile-logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            ) : (
              <>
                <button 
                  className="mobile-login-btn" 
                  onClick={() => openAuthModal('login')}
                >
                  Login
                </button>
                <button 
                  className="mobile-signup-btn" 
                  onClick={() => openAuthModal('signup')}
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}></div>}

      {/* Auth Modal */}
      {authModal.isOpen && (
        <AuthModal 
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          onClose={closeAuthModal}
          onSuccess={(userData) => {
            setUser(userData);
            closeAuthModal();
          }}
        />
      )}
    </>
  );
};

export default Header;
