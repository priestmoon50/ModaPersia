const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/multerConfig');

// روت‌های مربوط به محصولات
router.post('/', upload.array('images', 10), productController.createProduct); // ایجاد محصول جدید با آپلود تصاویر
router.get('/', productController.getProducts); // دریافت تمام محصولات
router.get('/:id', productController.getProductById); // دریافت یک محصول خاص بر اساس ID
router.put('/:id', upload.array('images', 10), productController.updateProduct); // به‌روزرسانی محصول بر اساس ID
router.delete('/:id', productController.deleteProduct); // حذف محصول بر اساس ID

module.exports = router;
