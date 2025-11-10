const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const User = require('../models/User');
const Task = require('../models/Task');
const { authenticate, requireMakerRole } = require('../middleware/auth');

/**
 * @route   GET /api/makers
 * @desc    Get all makers with filters
 * @access  Public
 */
router.get(
  '/',
  [
    query('tier').optional().isIn(['beginner', 'intermediate', 'pro']),
    query('skills').optional(),
    query('minRating').optional().isFloat({ min: 0, max: 5 }),
    query('lat').optional().isFloat(),
    query('lng').optional().isFloat(),
    query('radius').optional().isInt({ min: 1, max: 500 }),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
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

      const {
        tier,
        skills,
        minRating = 0,
        lat,
        lng,
        radius = 50,
        page = 1,
        limit = 20
      } = req.query;

      const query = {
        role: { $in: ['maker', 'both'] },
        status: 'active'
      };

      if (tier) query['makerProfile.tier'] = tier;
      if (minRating) query['makerProfile.rating.average'] = { $gte: parseFloat(minRating) };
      
      if (skills) {
        const skillsArray = skills.split(',').map(s => s.trim());
        query['makerProfile.skills'] = { $in: skillsArray };
      }

      // Location-based search
      if (lat && lng) {
        const radiusInMeters = radius * 1609.34;
        query['location.coordinates'] = {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: radiusInMeters
          }
        };
      }

      const skip = (page - 1) * limit;

      const [makers, total] = await Promise.all([
        User.find(query)
          .select('profile makerProfile location')
          .sort({ 'makerProfile.rating.average': -1, 'makerProfile.completedTasks': -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(query)
      ]);

      res.json({
        success: true,
        data: {
          makers,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/makers/:id
 * @desc    Get maker profile by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const maker = await User.findById(req.params.id)
      .select('profile makerProfile location createdAt');

    if (!maker || (maker.role !== 'maker' && maker.role !== 'both')) {
      return res.status(404).json({
        success: false,
        message: 'Maker not found'
      });
    }

    res.json({
      success: true,
      data: { maker }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/makers/me/tasks
 * @desc    Get current maker's tasks and assignments
 * @access  Private (Makers only)
 */
router.get('/me/tasks', authenticate, requireMakerRole, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {
      'assignments.makerId': req.user._id
    };

    if (status) {
      query['assignments.status'] = status;
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('businessOwnerId', 'businessProfile.businessName profile')
        .sort({ 'timeline.postedDate': -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Task.countDocuments(query)
    ]);

    // Filter to show only relevant assignment data
    const tasksWithAssignments = tasks.map(task => {
      const assignment = task.assignments.find(
        a => a.makerId.toString() === req.user._id.toString()
      );
      return {
        ...task,
        myAssignment: assignment
      };
    });

    res.json({
      success: true,
      data: {
        tasks: tasksWithAssignments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/makers/me/earnings
 * @desc    Get maker's earnings statistics
 * @access  Private (Makers only)
 */
router.get('/me/earnings', authenticate, requireMakerRole, async (req, res, next) => {
  try {
    const tasks = await Task.find({
      'assignments.makerId': req.user._id,
      'assignments.payment.status': 'paid'
    }).lean();

    const earnings = tasks.reduce((acc, task) => {
      const assignment = task.assignments.find(
        a => a.makerId.toString() === req.user._id.toString()
      );
      if (assignment && assignment.payment) {
        acc.total += assignment.payment.amount || 0;
        acc.count += 1;
      }
      return acc;
    }, { total: 0, count: 0 });

    const stats = {
      totalEarnings: earnings.total,
      paidTasks: earnings.count,
      averagePayPerTask: earnings.count > 0 ? earnings.total / earnings.count : 0,
      completedTasks: req.user.makerProfile.completedTasks,
      currentTier: req.user.makerProfile.tier,
      rating: req.user.makerProfile.rating
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
