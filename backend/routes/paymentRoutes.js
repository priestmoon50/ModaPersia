const express = require('express');
const {
  createPayment,
  getPaymentById,
  updatePaymentToSuccess,
  deletePayment,
} = require('../controllers/paymentController');
const { protectUser } = require('../middlewares/auth'); // استفاده از protectUser از auth.js

const router = express.Router();

// مسیر برای ایجاد یک پرداخت جدید
router.post('/', protectUser, async (req, res, next) => {
  try {
    await createPayment(req, res, next);
  } catch (error) {
    next(error);
  }
});

// مسیر برای دریافت پرداخت با شناسه
router.get('/:id', protectUser, async (req, res, next) => {
  try {
    await getPaymentById(req, res, next);
  } catch (error) {
    next(error);
  }
});

// مسیر برای بروزرسانی وضعیت پرداخت به موفقیت‌آمیز
router.put('/:id', protectUser, async (req, res, next) => {
  try {
    await updatePaymentToSuccess(req, res, next);
  } catch (error) {
    next(error);
  }
});

// مسیر برای حذف پرداخت
router.delete('/:id', protectUser, async (req, res, next) => {
  try {
    await deletePayment(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
