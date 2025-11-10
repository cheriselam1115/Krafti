const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const aiPricingService = require('../services/aiPricingService');
const { authenticate, requireBusinessRole } = require('../middleware/auth');

/**
 * @route   POST /api/ai-pricing/calculate
 * @desc    Calculate fair pay for a crafting task
 * @access  Private (Business owners only)
 */
router.post(
  '/calculate',
  authenticate,
  requireBusinessRole,
  [
    body('retailPrice').isFloat({ min: 0 }).withMessage('Retail price must be a positive number'),
    body('materialCost').isFloat({ min: 0 }).withMessage('Material cost must be a positive number'),
    body('taskDescription').notEmpty().withMessage('Task description is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('estimatedTimePerPiece').isInt({ min: 1 }).withMessage('Estimated time must be at least 1 minute'),
    body('complexityLevel').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid complexity level'),
    body('makerTier').optional().isIn(['beginner', 'intermediate', 'pro']).withMessage('Invalid maker tier')
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

      const pricingData = await aiPricingService.calculateFairPay(req.body);

      res.json({
        success: true,
        data: pricingData
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/ai-pricing/batch
 * @desc    Calculate batch pricing with volume discounts
 * @access  Private (Business owners only)
 */
router.post(
  '/batch',
  authenticate,
  requireBusinessRole,
  [
    body('retailPrice').isFloat({ min: 0 }),
    body('materialCost').isFloat({ min: 0 }),
    body('taskDescription').notEmpty(),
    body('estimatedTimePerPiece').isInt({ min: 1 }),
    body('complexityLevel').isIn(['beginner', 'intermediate', 'advanced']),
    body('quantities').optional().isArray().withMessage('Quantities must be an array')
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

      const { quantities, ...pricingParams } = req.body;
      const batchPricing = await aiPricingService.calculateBatchPricing(
        pricingParams,
        quantities
      );

      res.json({
        success: true,
        data: batchPricing
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/ai-pricing/optimize
 * @desc    Get optimal pricing suggestions (conservative, balanced, generous)
 * @access  Private (Business owners only)
 */
router.post(
  '/optimize',
  authenticate,
  requireBusinessRole,
  [
    body('retailPrice').isFloat({ min: 0 }),
    body('materialCost').isFloat({ min: 0 }),
    body('taskDescription').notEmpty(),
    body('estimatedTimePerPiece').isInt({ min: 1 }),
    body('complexityLevel').isIn(['beginner', 'intermediate', 'advanced'])
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

      const optimizedPricing = await aiPricingService.suggestOptimalPricing(req.body);

      res.json({
        success: true,
        data: optimizedPricing
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
