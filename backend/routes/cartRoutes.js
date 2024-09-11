const express = require('express');
const { check, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { addToCart, getCartItems, removeFromCart } = require('../controllers/cartController');
const { protectUser } = require('../middlewares/auth');

const router = express.Router();

// Middleware for validating addToCart input
const validateAddToCart = [
  check('productId')
    .not()
    .isEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid Product ID format'),
  check('quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer'),
  check('color')
    .not()
    .isEmpty()
    .withMessage('Color is required'),
  check('size')
    .not()
    .isEmpty()
    .withMessage('Size is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Add to cart route with authentication
router.post('/', protectUser, validateAddToCart, asyncHandler(addToCart));

// Get cart items route with authentication
router.get('/', protectUser, asyncHandler(getCartItems));

// Remove from cart route with authentication
router.delete('/:id', protectUser, asyncHandler(removeFromCart));

module.exports = router;
