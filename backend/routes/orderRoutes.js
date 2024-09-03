const express = require('express');
const router = express.Router();
const { protectUser, isAdmin } = require('../middlewares/auth');
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  deleteOrder,
  updateOrderToDelivered,
} = require('../controllers/orderController');

router.post('/', protectUser, addOrderItems);
router.get('/', protectUser, isAdmin, getOrders);
router.get('/myorders', protectUser, getMyOrders);
router.get('/:id', protectUser, getOrderById);
router.put('/:id/pay', protectUser, updateOrderToPaid);
router.put('/:id/deliver', protectUser, isAdmin, updateOrderToDelivered);
router.delete('/:id', protectUser, isAdmin, deleteOrder);

module.exports = router;
