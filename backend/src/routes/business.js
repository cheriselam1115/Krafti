const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { authenticate, requireBusinessRole } = require('../middleware/auth');

/**
 * @route   GET /api/business/dashboard
 * @desc    Get business owner dashboard statistics
 * @access  Private (Business owners only)
 */
router.get('/dashboard', authenticate, requireBusinessRole, async (req, res, next) => {
  try {
    const [
      totalTasks,
      activeTasks,
      completedTasks,
      totalSpent,
      recentTasks
    ] = await Promise.all([
      Task.countDocuments({ businessOwnerId: req.user._id }),
      Task.countDocuments({ 
        businessOwnerId: req.user._id, 
        status: { $in: ['open', 'in-progress'] }
      }),
      Task.countDocuments({ 
        businessOwnerId: req.user._id, 
        status: 'completed' 
      }),
      Task.aggregate([
        { $match: { businessOwnerId: req.user._id } },
        { $unwind: '$assignments' },
        { 
          $match: { 
            'assignments.payment.status': 'paid' 
          } 
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: '$assignments.payment.amount' } 
          } 
        }
      ]),
      Task.find({ businessOwnerId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('assignments.makerId', 'profile makerProfile.tier')
        .lean()
    ]);

    const stats = {
      totalTasks,
      activeTasks,
      completedTasks,
      totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
      recentTasks
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/business/tasks
 * @desc    Get all tasks for current business owner
 * @access  Private (Business owners only)
 */
router.get('/tasks', authenticate, requireBusinessRole, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = { businessOwnerId: req.user._id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignments.makerId', 'profile makerProfile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Task.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        tasks,
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
 * @route   POST /api/business/toggle-anonymous
 * @desc    Toggle anonymous mode for business profile
 * @access  Private (Business owners only)
 */
router.post('/toggle-anonymous', authenticate, requireBusinessRole, async (req, res, next) => {
  try {
    const { isAnonymous } = req.body;

    req.user.businessProfile.isAnonymous = isAnonymous;
    await req.user.save();

    res.json({
      success: true,
      message: `Anonymous mode ${isAnonymous ? 'enabled' : 'disabled'}`,
      data: {
        isAnonymous: req.user.businessProfile.isAnonymous
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
