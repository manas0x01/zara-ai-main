const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/appError');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(new AppError('Access denied. No token provided.', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user still exists
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
      }

      // Check if user account is active
      if (!user.isActive || user.accountStatus !== 'active') {
        return next(new AppError('Your account has been deactivated. Please contact support.', 401));
      }

      // Grant access to protected route
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token. Please log in again.', 401));
      } else if (error.name === 'TokenExpiredError') {
        return next(new AppError('Your token has expired. Please log in again.', 401));
      } else {
        return next(new AppError('Token verification failed.', 401));
      }
    }
  } catch (error) {
    next(error);
  }
};

// Restrict to certain roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive && user.accountStatus === 'active') {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we continue without user
        console.warn('Optional auth: Invalid token provided');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Verify refresh token
const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token is required.', 400));
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Find user and check if refresh token exists
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new AppError('Invalid refresh token.', 401));
      }

      // Check if refresh token exists in user's refresh tokens
      const tokenExists = user.refreshTokens.some(
        tokenObj => tokenObj.token === refreshToken && tokenObj.expiresAt > new Date()
      );

      if (!tokenExists) {
        return next(new AppError('Invalid or expired refresh token.', 401));
      }

      // Check if user account is active
      if (!user.isActive || user.accountStatus !== 'active') {
        return next(new AppError('Your account has been deactivated.', 401));
      }

      req.user = user;
      req.refreshToken = refreshToken;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return next(new AppError('Invalid or expired refresh token.', 401));
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Check if user is verified
const requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return next(new AppError('Please verify your email address to access this resource.', 403));
  }
  next();
};

// Rate limiting per user
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    if (requests.has(userId)) {
      const userRequests = requests.get(userId);
      const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
      requests.set(userId, validRequests);
    }

    // Get current requests for user
    const userRequests = requests.get(userId) || [];

    // Check if user exceeded rate limit
    if (userRequests.length >= maxRequests) {
      return next(new AppError(`Rate limit exceeded. Try again in ${Math.ceil(windowMs / 60000)} minutes.`, 429));
    }

    // Add current request
    userRequests.push(now);
    requests.set(userId, userRequests);

    next();
  };
};

module.exports = {
  protect,
  restrictTo,
  optionalAuth,
  verifyRefreshToken,
  requireVerification,
  userRateLimit
};
