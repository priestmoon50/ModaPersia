const express = require('express');
const router = express.Router();
const { protectAdmin, isAdmin } = require('../middlewares/auth');
const {
  getOrders,
  getOrderById,
  updateOrderToDelivered,
  deleteOrder,
} = require('../controllers/adminOrderController');
const logRequest = require('../utils/logRequest');

// مسیر برای دریافت تمام سفارشات توسط ادمین
router.get('/', protectAdmin, isAdmin, (req, res, next) => {
  logRequest("Admin Get All Orders Route Hit", req);
  getOrders(req, res, next)
    .then(() => logRequest("Admin Get All Orders Success", req))
    .catch((error) => {
      logRequest("Admin Get All Orders Error", req, { error: error.message });
      next(error);
    });
});

// مسیر برای دریافت جزئیات یک سفارش خاص توسط ادمین
router.get('/:id', protectAdmin, isAdmin, (req, res, next) => {
  logRequest("Admin Get Order By ID Route Hit", req);
  getOrderById(req, res, next)
    .then(() => logRequest("Admin Get Order By ID Success", req))
    .catch((error) => {
      logRequest("Admin Get Order By ID Error", req, { error: error.message });
      next(error);
    });
});

// مسیر برای بروزرسانی وضعیت تحویل
router.put('/:id/deliver', protectAdmin, isAdmin, (req, res, next) => {
  logRequest("Admin Update Order To Delivered Route Hit", req);
  updateOrderToDelivered(req, res, next)
    .then(() => logRequest("Admin Update Order To Delivered Success", req))
    .catch((error) => {
      logRequest("Admin Update Order To Delivered Error", req, { error: error.message });
      next(error);
    });
});

// مسیر برای حذف یک سفارش توسط ادمین
router.delete('/:id', protectAdmin, isAdmin, (req, res, next) => {
  logRequest("Admin Delete Order Route Hit", req);
  deleteOrder(req, res, next)
    .then(() => logRequest("Admin Delete Order Success", req))
    .catch((error) => {
      logRequest("Admin Delete Order Error", req, { error: error.message });
      next(error);
    });
});

module.exports = router;
