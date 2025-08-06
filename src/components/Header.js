import React, { useState, useEffect, useRef } from 'react';
import AuthModal from './AuthModal';
import apiService from '../services/api';
import './Auth.css';

const Header = () => {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = apiService.getCurrentUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    // Handle scroll for dynamic header behavior
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;

      setIsScrolled(currentScrollY > 50);
      
      // Hide header when scrolling down, show when scrolling up
      if (Math.abs(scrollDifference) > 10) {
        if (currentScrollY > 100) {
          setIsVisible(scrollDifference < 0 || currentScrollY < 200);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Handle click outside user menu
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowUserMenu(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [lastScrollY]);

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
    setShowUserMenu(false);
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : 'auto';
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    setShowUserMenu(false);
    document.body.style.overflow = 'auto';
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
        document.body.style.overflow = 'auto';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <>
      <nav 
        ref={headerRef}
        className={`
          ${mobileMenuOpen ? 'mobile-menu-open' : ''} 
          ${isScrolled ? 'scrolled' : ''} 
          ${isVisible ? 'visible' : 'hidden'}
        `}
      >
        <div className="nav-content">
          <div className="logo" onClick={() => scrollToSection('home')}>
            <span className="logo-text">Myra</span>
            <span className="logo-accent">AI</span>
          </div>
          
          {/* Desktop Navigation */}
          <ul className="nav-links desktop-only">
            <li>
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
                <i className="fas fa-home"></i>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
                <i className="fas fa-star"></i>
                <span>Features</span>
              </a>
            </li>
            <li>
              <a href="#use-cases" onClick={(e) => { e.preventDefault(); scrollToSection('use-cases'); }}>
                <i className="fas fa-lightbulb"></i>
                <span>Use Cases</span>
              </a>
            </li>
            <li>
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>
                <i className="fas fa-cogs"></i>
                <span>How It Works</span>
              </a>
            </li>
            <li>
              <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>
                <i className="fas fa-comments"></i>
                <span>Reviews</span>
              </a>
            </li>
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
                  <div className="user-avatar">
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">
                    {user.firstName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0]}
                  </span>
                  <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'} dropdown-arrow`}></i>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="user-avatar large">
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-full-name">
                          {user.firstName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0]}
                        </div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <a href="#profile" className="dropdown-item">
                      <i className="fas fa-user"></i> 
                      <span>Profile</span>
                    </a>
                    <a href="#settings" className="dropdown-item">
                      <i className="fas fa-cog"></i> 
                      <span>Settings</span>
                    </a>
                    <a href="#billing" className="dropdown-item">
                      <i className="fas fa-credit-card"></i> 
                      <span>Billing</span>
                    </a>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <i className="fas fa-sign-out-alt"></i> 
                      <span>Logout</span>
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
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </button>
                <button 
                  className="signup-btn" 
                  onClick={() => openAuthModal('signup')}
                >
                  <i className="fas fa-rocket"></i>
                  <span>Get Started</span>
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
          <div className="mobile-menu-content">
            <ul className="mobile-nav-links">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
                  <i className="fas fa-home"></i>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
                  <i className="fas fa-star"></i>
                  <span>Features</span>
                </a>
              </li>
              <li>
                <a href="#use-cases" onClick={(e) => { e.preventDefault(); scrollToSection('use-cases'); }}>
                  <i className="fas fa-lightbulb"></i>
                  <span>Use Cases</span>
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>
                  <i className="fas fa-cogs"></i>
                  <span>How It Works</span>
                </a>
              </li>
              <li>
                <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>
                  <i className="fas fa-comments"></i>
                  <span>Reviews</span>
                </a>
              </li>
            </ul>
            
            <div className="mobile-auth-buttons">
              {user ? (
                <div className="mobile-user-menu">
                  <div className="mobile-user-info">
                    <div className="user-avatar large">
                      {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <div className="user-name">
                        {user.firstName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0]}
                      </div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="mobile-user-actions">
                    <button className="mobile-profile-btn">
                      <i className="fas fa-user"></i>
                      <span>Profile</span>
                    </button>
                    <button className="mobile-settings-btn">
                      <i className="fas fa-cog"></i>
                      <span>Settings</span>
                    </button>
                    <button className="mobile-logout-btn" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mobile-auth-actions">
                  <button 
                    className="mobile-login-btn" 
                    onClick={() => openAuthModal('login')}
                  >
                    <i className="fas fa-sign-in-alt"></i>
                    <span>Login</span>
                  </button>
                  <button 
                    className="mobile-signup-btn" 
                    onClick={() => openAuthModal('signup')}
                  >
                    <i className="fas fa-rocket"></i>
                    <span>Get Started</span>
                  </button>
                </div>
              )}
            </div>
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
