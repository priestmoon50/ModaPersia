// controllers/adminOrderController.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc Get all orders
// @route GET /api/admin/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email').populate('orderItems.product');
    res.json(orders);
});

// @desc Get order by ID
// @route GET /api/admin/orders/:id
// @access Private/Admin
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product');
    
    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc Update order to delivered
// @route PUT /api/admin/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc Delete order
// @route DELETE /api/admin/orders/:id
// @access Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        await order.remove();
        res.json({ message: 'Order removed' });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    getOrders,
    getOrderById,
    updateOrderToDelivered,
    deleteOrder,
};
