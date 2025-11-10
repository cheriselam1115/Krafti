const { verifyToken } = require('../config/firebase');
const User = require('../models/User');

/**
 * Middleware to authenticate requests using Firebase token
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify Firebase token
    const decodedToken = await verifyToken(token);
    
    // Get user from database
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is not active' 
      });
    }

    // Attach user to request
    req.user = user;
    req.firebaseUser = decodedToken;
    
    // Update last active
    user.lastActive = new Date();
    await user.save();
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

/**
 * Middleware to check if user has specific role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role) && !roles.includes('both')) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

/**
 * Middleware to check if user can perform business actions
 */
const requireBusinessRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (req.user.role !== 'business' && req.user.role !== 'both') {
    return res.status(403).json({ 
      success: false, 
      message: 'Business account required' 
    });
  }

  next();
};

/**
 * Middleware to check if user can perform maker actions
 */
const requireMakerRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (req.user.role !== 'maker' && req.user.role !== 'both') {
    return res.status(403).json({ 
      success: false, 
      message: 'Maker account required' 
    });
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  requireBusinessRole,
  requireMakerRole
};
