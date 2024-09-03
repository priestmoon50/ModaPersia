const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const { sendLowStockAlert } = require("../utils/alerts");
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    paymentResult,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // اعتبارسنجی اطلاعات وارد شده
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items provided" });
  }

  if (
    !shippingAddress ||
    !shippingAddress.phone ||
    !shippingAddress.email ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    return res.status(400).json({ message: "All shipping address fields are required" });
  }

  // تبدیل productId به ObjectId و بررسی صحت آن
  const modifiedOrderItems = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      return {
        product: product._id, // استفاده از ObjectId محصول واقعی
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      };
    })
  );

  // ایجاد یک سفارش جدید
  const order = new Order({
    user: req.user._id,
    orderItems: modifiedOrderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // بروزرسانی موجودی محصولات
  await updateProductStock(modifiedOrderItems);

  // ذخیره سفارش
  const createdOrder = await order.save();

  // ایجاد یک پرداخت جدید با ارجاع به سفارش ایجاد شده
  const payment = new Payment({
    order: createdOrder._id,
    method: paymentMethod,  // استفاده از paymentMethod برای مقداردهی فیلد method
    paymentResult,
    amount: totalPrice,
    user: req.user._id,
  });

  const savedPayment = await payment.save();

  // اضافه کردن اطلاعات پرداخت به سفارش
  createdOrder.payment = savedPayment._id;
  await createdOrder.save();

  res.status(201).json(createdOrder);
});

// تابع بروزرسانی موجودی محصولات
const updateProductStock = async (orderItems) => {
  for (let item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      // کاهش موجودی محصول
      product.stock -= item.quantity;
      if (product.stock < 0) {
        product.stock = 0;
      }
      await product.save();

      if (product.stock <= 2) {
        await sendLowStockAlert(product);
      }
    } else {
      throw new Error(`Product with ID ${item.product} not found`);
    }
  }
};


// سایر متدها بدون تغییر باقی می‌مانند...



// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email phoneNumber")
    .populate("paymentMethod");

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isPaid) {
      return res.status(400).json({ message: "Order is already paid" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isDelivered) {
      return res.status(400).json({ message: "Order is already delivered" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    // ارسال پیامک به کاربر
    if (order.shippingAddress.phone) {
      try {
        const message = await client.messages.create({
          body: `Your order with ID ${order._id} has been delivered.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: order.shippingAddress.phone,
        });
        console.log("SMS sent:", message.sid);
      } catch (error) {
        console.error("Failed to send SMS:", error.message);
      }
    }

    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// @desc Get logged in user's orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc Get all orders
// @route GET /api/orders
// @access Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "id name")
    .populate("paymentMethod");
  res.json(orders);
});

// @desc Delete order
// @route DELETE /api/orders/:id
// @access Private
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await Order.deleteOne({ _id: req.params.id });
    res.json({ message: "Order removed" });
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  deleteOrder,
};
