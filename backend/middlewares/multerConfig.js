const multer = require('multer');
const path = require('path');

// تنظیمات Multer برای ذخیره تصاویر
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // مسیر ذخیره تصاویر
  },
  filename: (req, file, cb) => {
    // افزودن Date.now() به نام فایل برای جلوگیری از تکرار نام
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// فیلتر برای فایل‌های تصویری
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Only images are allowed (JPEG, JPG, PNG)'));
  }
};

// تنظیمات Multer شامل محدودیت حجم فایل و فیلترها
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // حداکثر حجم فایل 5MB
  fileFilter: fileFilter
});

module.exports = upload;
