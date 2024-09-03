const mongoose = require('mongoose');

// تعریف مقادیر استاندارد برای رنگ‌ها
const colorEnum = ["Red", "Blue", "Green", "Yellow", "Black", "White", "Purple", "Orange", "Pink", "Brown"];

// تعریف مقادیر استاندارد برای سایزها
const sizeEnum = ["XS", "S", "M", "L", "XL", "XXL"];

// تعریف Schema برای محصول
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter the product name'],
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter the product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter the product price'],
    min: [0, 'Price cannot be less than 0']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount percentage cannot be less than 0'],
    max: [100, 'Discount percentage cannot exceed 100']
  },
  sizes: {
    type: [String],
    enum: sizeEnum, // فقط سایزهای مشخص شده مجاز هستند
    required: [true, 'Please specify the available sizes'],
    validate: [arrayLimit, 'Product must have at least one size']
  },
  colors: {
    type: [String],
    enum: colorEnum, // فقط رنگ‌های مشخص شده مجاز هستند
    required: [true, 'Please specify the available colors'],
    validate: [arrayLimit, 'Product must have at least one color']
  },
  images: {
    type: [String],
    required: [true, 'Please provide product images'],
    validate: [arrayLimit, 'Product must have at least one image']
  },
}, { timestamps: true });

// ولیدیشن برای تعداد آیتم‌ها در آرایه‌ها (حداقل یک آیتم)
function arrayLimit(val) {
  return Array.isArray(val) && val.length > 0;
}

// ایجاد مدل Product
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
