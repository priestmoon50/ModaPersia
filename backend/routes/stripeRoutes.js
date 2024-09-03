const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { createPaymentIntent } = require('../controllers/stripeController');
const router = express.Router();

// Validation middleware
const validatePaymentInput = [
  check('amount')
    .isInt({ gt: 0 })
    .withMessage('Amount must be a positive integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Route to create a payment intent
router.post('/create-payment-intent', validatePaymentInput, asyncHandler(createPaymentIntent));

module.exports = router;
