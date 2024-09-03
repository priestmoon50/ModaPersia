const express = require('express');
const router = express.Router();
const { generateAdminToken } = require('../utils/generateAdminToken');
const { body, validationResult } = require('express-validator');
const winston = require('winston');
const Admin = require('../models/Admin');
const { createAdmin } = require('../controllers/adminController');
const { protectAdmin, isAdmin } = require('../middlewares/auth');
const logRequest = require('../utils/logRequest');

// Middleware for validating inputs
const validateInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logRequest("Validation Error", req, { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Admin login route
router.post('/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateInputs,
  async (req, res) => {
    logRequest("Admin Login Route Hit", req);
    try {
      const admin = await Admin.findOne({ email: req.body.email });
      if (!admin) {
        logRequest("Admin not found", req);
        return res.status(401).json({ message: 'Admin not found' });
      }

      const isMatch = await admin.comparePassword(req.body.password);
      if (!isMatch) {
        logRequest("Invalid password", req);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateAdminToken(admin);
      logRequest("Admin login successful", req, { token });
      res.status(200).json({ message: "Admin login successful", token });
    } catch (error) {
      winston.error("Error logging in admin:", error);
      logRequest("Error in Admin Login", req, { error: error.message });
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create new admin route
router.post('/create', protectAdmin, isAdmin, async (req, res, next) => {
  logRequest("Create Admin Route Hit", req);
  try {
    await createAdmin(req, res, next);
    logRequest("Admin Created Successfully", req);
  } catch (error) {
    logRequest("Error in Creating Admin", req, { error: error.message });
    next(error);
  }
});

// Admin dashboard route
router.get('/dashboard', protectAdmin, isAdmin, (req, res) => {
  logRequest("Admin Dashboard Accessed", req);
  res.status(200).json({ message: "Welcome to Admin Dashboard" });
});

// Admin order management routes
router.post('/orders', protectAdmin, isAdmin, async (req, res, next) => {
  logRequest("Create Order by Admin Route Hit", req);
  try {
    await addOrderItems(req, res, next);
    logRequest("Order Created by Admin Successfully", req);
  } catch (error) {
    logRequest("Error in Creating Order by Admin", req, { error: error.message });
    next(error);
  }
});

router.get('/orders', protectAdmin, isAdmin, async (req, res, next) => {
  logRequest("Get All Orders by Admin Route Hit", req);
  try {
    await getOrders(req, res, next);
    logRequest("Orders Retrieved by Admin Successfully", req);
  } catch (error) {
    logRequest("Error in Getting Orders by Admin", req, { error: error.message });
    next(error);
  }
});

router.get('/orders/:id', protectAdmin, isAdmin, async (req, res, next) => {
  logRequest("Get Order by ID by Admin Route Hit", req);
  try {
    await getOrderById(req, res, next);
    logRequest("Order Retrieved by ID by Admin Successfully", req);
  } catch (error) {
    logRequest("Error in Getting Order by ID by Admin", req, { error: error.message });
    next(error);
  }
});

router.put('/orders/:id/deliver', protectAdmin, isAdmin, async (req, res, next) => {
  logRequest("Update Order to Delivered by Admin Route Hit", req);
  try {
    await updateOrderToDelivered(req, res, next);
    logRequest("Order Updated to Delivered by Admin Successfully", req);
  } catch (error) {
    logRequest("Error in Updating Order to Delivered by Admin", req, { error: error.message });
    next(error);
  }
});

router.delete('/orders/:id', protectAdmin, isAdmin, async (req, res, next) => {
  logRequest("Delete Order by Admin Route Hit", req);
  try {
    await deleteOrder(req, res, next);
    logRequest("Order Deleted by Admin Successfully", req);
  } catch (error) {
    logRequest("Error in Deleting Order by Admin", req, { error: error.message });
    next(error);
  }
});

module.exports = router;
