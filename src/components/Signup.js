import React, { useState } from 'react';
import apiService from '../services/api';

const Signup = ({ onSwitchToLogin, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await apiService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms,
        subscribeNewsletter: formData.subscribeNewsletter
      });

      // Automatically log in the user after successful registration
      try {
        const loginResult = await apiService.login({
          email: formData.email,
          password: formData.password
        });

        // If we have the onSuccess callback, call it with user data
        if (onSuccess && loginResult.data && loginResult.data.user) {
          onSuccess(loginResult.data.user);
        } else {
          alert(`Account created successfully! Please check your email (${formData.email}) to verify your account.`);
          onClose();
        }
      } catch (loginError) {
        // If auto-login fails, still show success message
        console.log('Auto-login failed:', loginError);
        alert(`Account created successfully! Please check your email (${formData.email}) to verify your account.`);
        onClose();
      }
    } catch (err) {
      if (err.message.includes('validation')) {
        // This could be expanded to handle specific validation errors
        setErrors({ general: err.message });
      } else {
        setErrors({ general: err.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form signup-form">
      <div className="auth-header">
        <h2>Create Your Account</h2>
        <p>Join Myra AI and unlock the power of intelligent assistance</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-content">
        {errors.general && (
          <div className="auth-error">
            <span>{errors.general}</span>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              className={errors.firstName ? 'error' : ''}
              autoComplete="given-name"
            />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              className={errors.lastName ? 'error' : ''}
              autoComplete="family-name"
            />
            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className={errors.email ? 'error' : ''}
            autoComplete="email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a strong password"
            className={errors.password ? 'error' : ''}
            autoComplete="new-password"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
          <div className="password-requirements">
            <small>Password must be at least 8 characters with uppercase, lowercase, and number</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            className={errors.confirmPassword ? 'error' : ''}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
        </div>

        <div className="form-checkboxes">
          <label className={`checkbox-label ${errors.agreeToTerms ? 'error' : ''}`}>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
            />
            <span className="checkmark"></span>
            I agree to the <a href="#terms" target="_blank">Terms of Service</a> and <a href="#privacy" target="_blank">Privacy Policy</a>
          </label>
          {errors.agreeToTerms && <span className="field-error">{errors.agreeToTerms}</span>}

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="subscribeNewsletter"
              checked={formData.subscribeNewsletter}
              onChange={handleInputChange}
            />
            <span className="checkmark"></span>
            Subscribe to our newsletter for updates and AI tips
          </label>
        </div>

        <button 
          type="submit" 
          className="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-btn google-btn">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>
          
          <button type="button" className="social-btn github-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#333">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Sign up with GitHub
          </button>
        </div>

        <div className="auth-switch">
          <span>Already have an account? </span>
          <button type="button" onClick={onSwitchToLogin} className="switch-btn">
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
