const express = require('express');
const User = require('../models/User');
const { AppError } = require('../utils/appError');
const { protect, restrictTo } = require('../middleware/auth');
const {
  validateUpdateProfile,
  validateChangePassword,
  handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', validateUpdateProfile, handleValidationErrors, async (req, res, next) => {
  try {
    const allowedFields = [
      'firstName',
      'lastName',
      'subscribeNewsletter',
      'preferences'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Handle nested preference updates
    if (req.body.preferences) {
      updates.preferences = {
        ...req.user.preferences,
        ...req.body.preferences
      };
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
          subscribeNewsletter: user.subscribeNewsletter,
          preferences: user.preferences,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Change password
// @route   PUT /api/user/change-password
// @access  Private
router.put('/change-password', validateChangePassword, handleValidationErrors, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get current user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 400));
    }

    // Update password
    user.password = newPassword;
    
    // Clear all refresh tokens except current session (optional)
    // user.refreshTokens = [];
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
router.delete('/account', async (req, res, next) => {
  try {
    const { password, confirmDeletion } = req.body;

    if (!password) {
      return next(new AppError('Password is required to delete account', 400));
    }

    if (confirmDeletion !== 'DELETE') {
      return next(new AppError('Please type "DELETE" to confirm account deletion', 400));
    }

    // Get current user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify password
    if (!(await user.comparePassword(password))) {
      return next(new AppError('Incorrect password', 400));
    }

    // Soft delete - deactivate account instead of hard delete
    user.isActive = false;
    user.accountStatus = 'deactivated';
    user.refreshTokens = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user dashboard data
// @route   GET /api/user/dashboard
// @access  Private
router.get('/dashboard', async (req, res, next) => {
  try {
    const user = req.user;

    // Calculate user statistics
    const stats = {
      totalInteractions: user.aiInteractions,
      accountAge: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)), // days
      lastLoginDays: user.lastLogin ? Math.floor((Date.now() - user.lastLogin) / (1000 * 60 * 60 * 24)) : null,
      totalLogins: user.loginCount
    };

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
          isVerified: user.isVerified,
          preferences: user.preferences,
          stats
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user avatar
// @route   PUT /api/user/avatar
// @access  Private
router.put('/avatar', async (req, res, next) => {
  try {
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return next(new AppError('Avatar URL is required', 400));
    }

    // Basic URL validation
    try {
      new URL(avatarUrl);
    } catch (error) {
      return next(new AppError('Invalid avatar URL', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user activity log
// @route   GET /api/user/activity
// @access  Private
router.get('/activity', async (req, res, next) => {
  try {
    const user = req.user;

    const activity = {
      recentLogins: {
        lastLogin: user.lastLogin,
        totalLogins: user.loginCount
      },
      account: {
        createdAt: user.createdAt,
        isVerified: user.isVerified,
        accountStatus: user.accountStatus
      },
      usage: {
        aiInteractions: user.aiInteractions
      },
      activeSessions: user.refreshTokens.length
    };

    res.status(200).json({
      success: true,
      data: { activity }
    });
  } catch (error) {
    next(error);
  }
});

// Admin only routes
router.use(restrictTo('admin'));

// @desc    Get all users (Admin only)
// @route   GET /api/user/admin/users
// @access  Private/Admin
router.get('/admin/users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) {
      filter.accountStatus = req.query.status;
    }
    if (req.query.verified !== undefined) {
      filter.isVerified = req.query.verified === 'true';
    }

    const users = await User.find(filter)
      .select('-password -refreshTokens')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user status (Admin only)
// @route   PUT /api/user/admin/users/:id/status
// @access  Private/Admin
router.put('/admin/users/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'suspended', 'deactivated'];

    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid account status', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        accountStatus: status,
        isActive: status === 'active'
      },
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: `User account status updated to ${status}`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
