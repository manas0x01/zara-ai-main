import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', onSuccess }) => {
  const [mode, setMode] = useState(initialMode);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>
          <span>&times;</span>
        </button>
        
        <div className="auth-modal-content">
          {mode === 'login' ? (
            <Login 
              onSwitchToSignup={() => setMode('signup')} 
              onClose={onClose}
              onSuccess={onSuccess}
            />
          ) : (
            <Signup 
              onSwitchToLogin={() => setMode('login')} 
              onClose={onClose}
              onSuccess={onSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
