const mongoose = require('mongoose');

// تعریف مدل سبد خرید
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true // ایندکس برای بهبود عملکرد
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Product ID is required'], // پیام خطا برای ID محصول
        ref: 'Product',
        index: true // ایندکس برای بهبود عملکرد
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'], // پیام خطا برای مقدار quantity
        min: [1, 'Quantity must be at least 1'], // حداقل مقدار برای quantity
        default: 1
      },
      color: {
        type: String,
        required: true // رنگ محصول باید ذخیره شود
      },
      size: {
        type: String,
        required: true // سایز محصول باید ذخیره شود
      },
      price: {
        type: Number,
        required: true // قیمت نهایی محصول باید ذخیره شود
      },
      discount: {
        type: Number, // تخفیف محصول به صورت درصد
        default: 0,  // به طور پیش‌فرض تخفیفی وجود ندارد
        min: [0, 'Discount cannot be less than 0'],
        max: [100, 'Discount cannot be more than 100']
      }
    }
  ]
}, {
  timestamps: true // افزودن زمان‌های ایجاد و بروز رسانی
});

// روش نمونه برای اضافه کردن آیتم به سبد خرید
cartSchema.methods.addItem = async function(product, quantity = 1, color, size, price, discount = 0) {
  // بررسی وجود آیتم مشابه در سبد خرید
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === product._id.toString() && 
    item.color === color &&
    item.size === size
  );

  // اگر آیتم وجود داشت، مقدار آن را افزایش دهیم
  if (existingItemIndex >= 0) {
    this.items[existingItemIndex].quantity += quantity;
    
    // حذف آیتم اگر مقدار کمتر از 1 باشد
    if (this.items[existingItemIndex].quantity <= 0) {
      return this.removeItem(product._id, color, size);
    }
  } else {
    // بررسی مقدار quantity قبل از افزودن
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0 to add an item.');
    }
    
    // اضافه کردن آیتم جدید به سبد خرید
    this.items.push({ product, quantity, color, size, price, discount });
  }

  return this.save();
};

// روش نمونه برای حذف آیتم از سبد خرید
cartSchema.methods.removeItem = async function(productId, color, size) {
  this.items = this.items.filter(item => 
    !(item.product.toString() === productId.toString() && 
      item.color === color &&
      item.size === size)
  );

  // حذف سبد خرید اگر خالی باشد
  if (this.items.length === 0) {
    await this.remove();
  } else {
    await this.save();
  }
};

// روش نمونه برای محاسبه مجموع قیمت‌ها
cartSchema.methods.calculateTotal = async function() {
  // populate برای گرفتن اطلاعات محصولات
  await this.populate('items.product').execPopulate();

  // محاسبه مجموع قیمت با اعمال تخفیف
  const total = this.items.reduce((acc, item) => {
    const finalPrice = item.price * (1 - item.discount / 100); // محاسبه قیمت نهایی با تخفیف
    return acc + finalPrice * item.quantity;
  }, 0);

  return total;
};

// روش نمونه برای نمایش سبد خرید به کاربر
cartSchema.methods.displayCart = async function() {
  // populate برای دریافت جزئیات محصول مانند نام و قیمت
  await this.populate('items.product', 'name price').execPopulate();
  
  return this.items.map(item => {
    const finalPrice = item.price * (1 - item.discount / 100); // محاسبه قیمت نهایی با تخفیف
    return {
      name: item.product.name,
      price: item.price,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      discount: item.discount,
      finalPrice, // قیمت نهایی با تخفیف
      total: finalPrice * item.quantity // مجموع قیمت با احتساب تخفیف
    };
  });
};

// ایجاد مدل سبد خرید و صادر کردن آن
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
