const asyncHandler = require("express-async-handler");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

// @desc Create a new payment
// @route POST /api/payments
// @access Private
const createPayment = asyncHandler(async (req, res) => {
  const { paymentMethod, paymentResult, orderId, amount } = req.body;
  // اعتبارسنجی داده‌های ورودی
  if (!paymentMethod || !paymentResult || !orderId) {
    res.status(400);
    throw new Error(
      "Payment method, result, order ID, and amount are required"
    );
  }
  // بررسی اینکه سفارش وجود دارد
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  // ایجاد یک پرداخت جدید
  const payment = new Payment({
    method: paymentMethod,
    paymentResult,
    order: orderId, // ذخیره ID سفارش
    amount,
    user: req.user._id, // فرض بر این است که کاربر احراز هویت شده
  });
  const createdPayment = await payment.save();
  res.status(201).json(createdPayment);
});

// @desc Get payment by ID
// @route GET /api/payments/:id
// @access Private
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (payment) {
    res.json(payment);
  } else {
    res.status(404);
    throw new Error("Payment not found");
  }
});

// @desc Update payment to successful
// @route PUT /api/payments/:id
// @access Private
const updatePaymentToSuccess = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (payment) {
    payment.isPaid = true;
    payment.paidAt = Date.now();

    const updatedPayment = await payment.save();
    res.json(updatedPayment);
  } else {
    res.status(404);
    throw new Error("Payment not found");
  }
});

// @desc Delete a payment
// @route DELETE /api/payments/:id
// @access Private/Admin
const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (payment) {
    await payment.remove();
    res.json({ message: "Payment removed" });
  } else {
    res.status(404);
    throw new Error("Payment not found");
  }
});

module.exports = {
  createPayment,
  getPaymentById,
  updatePaymentToSuccess,
  deletePayment,
};
