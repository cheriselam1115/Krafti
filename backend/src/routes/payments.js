const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Task = require('../models/Task');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

/**
 * @route   POST /api/payments/create-customer
 * @desc    Create a Stripe customer for user
 * @access  Private
 */
router.post('/create-customer', authenticate, async (req, res, next) => {
  try {
    if (req.user.paymentInfo.stripeCustomerId) {
      return res.json({
        success: true,
        data: { customerId: req.user.paymentInfo.stripeCustomerId }
      });
    }

    const customer = await stripe.customers.create({
      email: req.user.email,
      name: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
      metadata: {
        userId: req.user._id.toString()
      }
    });

    req.user.paymentInfo.stripeCustomerId = customer.id;
    await req.user.save();

    res.json({
      success: true,
      data: { customerId: customer.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/payments/create-connect-account
 * @desc    Create a Stripe Connect account for makers
 * @access  Private (Makers only)
 */
router.post('/create-connect-account', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'maker' && req.user.role !== 'both') {
      return res.status(403).json({
        success: false,
        message: 'Only makers can create Connect accounts'
      });
    }

    if (req.user.paymentInfo.stripeAccountId) {
      return res.json({
        success: true,
        data: { accountId: req.user.paymentInfo.stripeAccountId }
      });
    }

    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: req.user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      },
      metadata: {
        userId: req.user._id.toString()
      }
    });

    req.user.paymentInfo.stripeAccountId = account.id;
    await req.user.save();

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/maker/onboarding/refresh`,
      return_url: `${process.env.FRONTEND_URL}/maker/onboarding/complete`,
      type: 'account_onboarding'
    });

    res.json({
      success: true,
      data: {
        accountId: account.id,
        onboardingUrl: accountLink.url
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/payments/process-payment
 * @desc    Process payment for completed task
 * @access  Private (Business owners only)
 */
router.post('/process-payment', authenticate, async (req, res, next) => {
  try {
    const { taskId, assignmentId } = req.body;

    const task = await Task.findById(taskId).populate('assignments.makerId');

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

    const assignment = task.assignments.id(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    if (assignment.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Assignment must be approved before payment'
      });
    }

    const maker = await User.findById(assignment.makerId);

    if (!maker.paymentInfo.stripeAccountId) {
      return res.status(400).json({
        success: false,
        message: 'Maker has not set up payment account'
      });
    }

    // Calculate payment amount
    const amount = task.pricing.payPerPiece * assignment.quantityCompleted;

    // Create transfer to maker's Connect account
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      destination: maker.paymentInfo.stripeAccountId,
      description: `Payment for task: ${task.title}`,
      metadata: {
        taskId: task._id.toString(),
        assignmentId: assignment._id.toString(),
        makerId: maker._id.toString(),
        businessOwnerId: req.user._id.toString()
      }
    });

    // Update assignment payment status
    assignment.payment.status = 'paid';
    assignment.payment.amount = amount;
    assignment.payment.paidAt = new Date();
    assignment.payment.transactionId = transfer.id;
    assignment.status = 'paid';

    await task.save();

    // Update maker's earnings
    maker.makerProfile.totalEarnings += amount;
    maker.makerProfile.completedTasks += 1;
    await maker.save();

    // Update business owner's total spent
    req.user.businessProfile.totalSpent += amount;
    await req.user.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        transferId: transfer.id,
        amount
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/payments/balance
 * @desc    Get maker's available balance
 * @access  Private (Makers only)
 */
router.get('/balance', authenticate, async (req, res, next) => {
  try {
    if (!req.user.paymentInfo.stripeAccountId) {
      return res.json({
        success: true,
        data: { available: 0, pending: 0 }
      });
    }

    const balance = await stripe.balance.retrieve({
      stripeAccount: req.user.paymentInfo.stripeAccountId
    });

    res.json({
      success: true,
      data: {
        available: balance.available[0]?.amount / 100 || 0,
        pending: balance.pending[0]?.amount / 100 || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
