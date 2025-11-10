const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { verifyToken } = require('../config/firebase');
const { authenticate } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('firebaseToken').notEmpty().withMessage('Firebase token is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').isIn(['maker', 'business', 'both']).withMessage('Invalid role'),
    body('profile.firstName').notEmpty().withMessage('First name is required'),
    body('profile.lastName').notEmpty().withMessage('Last name is required')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { firebaseToken, email, role, profile, location, makerProfile, businessProfile } = req.body;

      // Verify Firebase token
      const decodedToken = await verifyToken(firebaseToken);
      
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ firebaseUid: decodedToken.uid }, { email }] 
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      // Create new user
      const user = new User({
        firebaseUid: decodedToken.uid,
        email,
        role,
        profile,
        location,
        ...(role === 'maker' || role === 'both' ? { makerProfile } : {}),
        ...(role === 'business' || role === 'both' ? { businessProfile } : {})
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            profile: user.profile
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  authenticate,
  async (req, res, next) => {
    try {
      const { profile, location, makerProfile, businessProfile } = req.body;
      
      const user = req.user;

      if (profile) {
        user.profile = { ...user.profile, ...profile };
      }

      if (location) {
        user.location = { ...user.location, ...location };
      }

      if (makerProfile && (user.role === 'maker' || user.role === 'both')) {
        user.makerProfile = { ...user.makerProfile, ...makerProfile };
      }

      if (businessProfile && (user.role === 'business' || user.role === 'both')) {
        user.businessProfile = { ...user.businessProfile, ...businessProfile };
      }

      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/auth/switch-role
 * @desc    Switch user role (for users with 'both' role)
 * @access  Private
 */
router.post('/switch-role', authenticate, async (req, res, next) => {
  try {
    const { activeRole } = req.body;

    if (!['maker', 'business'].includes(activeRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    if (req.user.role !== 'both') {
      return res.status(400).json({
        success: false,
        message: 'User does not have dual role capability'
      });
    }

    res.json({
      success: true,
      message: 'Role switched successfully',
      data: { activeRole }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
