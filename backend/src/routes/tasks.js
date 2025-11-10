const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const { authenticate, requireBusinessRole, requireMakerRole } = require('../middleware/auth');
const aiPricingService = require('../services/aiPricingService');

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private (Business owners only)
 */
router.post(
  '/',
  authenticate,
  requireBusinessRole,
  [
    body('title').notEmpty().trim().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').isIn(['crochet', 'knitting', 'jewelry', 'macrame', 'sewing', 'woodworking', 'pottery', 'other']),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('complexity').isIn(['beginner', 'intermediate', 'advanced']),
    body('estimatedTimePerPiece').isInt({ min: 1 }),
    body('pricing.retailPrice').isFloat({ min: 0 }),
    body('pricing.materialCost').isFloat({ min: 0 })
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

      const taskData = {
        ...req.body,
        businessOwnerId: req.user._id
      };

      // If pay per piece is not provided, calculate it using AI
      if (!taskData.pricing.payPerPiece) {
        const pricingCalculation = await aiPricingService.calculateFairPay({
          retailPrice: taskData.pricing.retailPrice,
          materialCost: taskData.pricing.materialCost,
          desiredProfitMargin: 0.3,
          taskDescription: taskData.description,
          quantity: taskData.quantity,
          estimatedTimePerPiece: taskData.estimatedTimePerPiece,
          complexityLevel: taskData.complexity
        });

        taskData.pricing.payPerPiece = pricingCalculation.recommendedPayPerPiece;
        taskData.pricing.calculationMetadata = {
          method: pricingCalculation.breakdown.calculationMethod,
          ownerProfit: pricingCalculation.ownerProfit,
          ownerProfitMargin: pricingCalculation.ownerProfitMargin,
          makerHourlyRate: pricingCalculation.makerHourlyRate,
          aiRecommendations: pricingCalculation.aiRecommendations
        };
      }

      taskData.pricing.totalBudget = taskData.pricing.payPerPiece * taskData.quantity;

      const task = new Task(taskData);
      await task.save();

      // Update business owner's task count
      req.user.businessProfile.tasksPosted += 1;
      req.user.businessProfile.activeTasks += 1;
      await req.user.save();

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: { task }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with filters
 * @access  Public
 */
router.get(
  '/',
  [
    query('status').optional().isIn(['draft', 'open', 'in-progress', 'completed', 'cancelled']),
    query('category').optional(),
    query('complexity').optional().isIn(['beginner', 'intermediate', 'advanced']),
    query('minPay').optional().isFloat({ min: 0 }),
    query('maxPay').optional().isFloat({ min: 0 }),
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
        status = 'open',
        category,
        complexity,
        minPay,
        maxPay,
        lat,
        lng,
        radius = 50,
        page = 1,
        limit = 20,
        search
      } = req.query;

      const query = { status };

      if (category) query.category = category;
      if (complexity) query.complexity = complexity;
      
      if (minPay || maxPay) {
        query['pricing.payPerPiece'] = {};
        if (minPay) query['pricing.payPerPiece'].$gte = parseFloat(minPay);
        if (maxPay) query['pricing.payPerPiece'].$lte = parseFloat(maxPay);
      }

      // Location-based search
      if (lat && lng) {
        const radiusInMeters = radius * 1609.34; // Convert miles to meters
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

      // Text search
      if (search) {
        query.$text = { $search: search };
      }

      const skip = (page - 1) * limit;

      const [tasks, total] = await Promise.all([
        Task.find(query)
          .populate('businessOwnerId', 'businessProfile.businessName businessProfile.brandLogo profile')
          .sort({ 'timeline.postedDate': -1, featured: -1 })
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
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('businessOwnerId', 'businessProfile profile location')
      .populate('assignments.makerId', 'profile makerProfile.tier makerProfile.rating');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Increment view count
    task.views += 1;
    await task.save();

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private (Task owner only)
 */
router.put('/:id', authenticate, requireBusinessRole, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.businessOwnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'title', 'description', 'quantity', 'complexity', 
      'estimatedTimePerPiece', 'pricing', 'materials', 
      'instructions', 'requirements', 'timeline', 'displaySettings'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/tasks/:id/apply
 * @desc    Apply for a task as a maker
 * @access  Private (Makers only)
 */
router.post(
  '/:id/apply',
  authenticate,
  requireMakerRole,
  [body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      if (!task.canMakerApply(req.user)) {
        return res.status(400).json({
          success: false,
          message: 'You do not meet the requirements for this task'
        });
      }

      const { quantity } = req.body;

      if (quantity > task.remainingQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${task.remainingQuantity} pieces available`
        });
      }

      // Check if maker already applied
      const existingApplication = task.assignments.find(
        a => a.makerId.toString() === req.user._id.toString()
      );

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied for this task'
        });
      }

      task.assignMaker(req.user._id, quantity);
      task.applications += 1;
      await task.save();

      res.json({
        success: true,
        message: 'Application submitted successfully',
        data: { task }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/tasks/:id/assignments/:assignmentId/accept
 * @desc    Accept or reject a maker's application
 * @access  Private (Task owner only)
 */
router.post(
  '/:id/assignments/:assignmentId/accept',
  authenticate,
  requireBusinessRole,
  [body('accept').isBoolean().withMessage('Accept must be a boolean')],
  async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      if (task.businessOwnerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      const assignment = task.assignments.id(req.params.assignmentId);

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found'
        });
      }

      const { accept } = req.body;

      if (accept) {
        assignment.status = 'accepted';
        assignment.acceptedAt = new Date();
      } else {
        assignment.status = 'rejected';
      }

      await task.save();

      res.json({
        success: true,
        message: accept ? 'Maker accepted' : 'Maker rejected',
        data: { task }
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
