const mongoose = require('mongoose');

// تعریف مدل سبد خرید
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true  // ایندکس برای بهبود عملکرد
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Product ID is required'],  // پیام خطا برای ID محصول
        ref: 'Product',
        index: true  // ایندکس برای بهبود عملکرد
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'],  // پیام خطا برای مقدار quantity
        min: [1, 'Quantity must be at least 1'],  // حداقل مقدار برای quantity
        default: 1
      },
      color: {
        type: String,
        required: true,  // رنگ محصول باید ذخیره شود
      },
      size: {
        type: String,
        required: true,  // سایز محصول باید ذخیره شود
      },
      price: {
        type: Number,
        required: true,  // قیمت نهایی محصول باید ذخیره شود
      }
    }
  ]
}, {
  timestamps: true
});

// روش نمونه برای اضافه کردن آیتم به سبد خرید
cartSchema.methods.addItem = async function(product, quantity = 1, color, size, price) {
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === product._id.toString() && 
    item.color === color &&
    item.size === size
  );
  
  if (existingItemIndex >= 0) {
    this.items[existingItemIndex].quantity += quantity;
    if (this.items[existingItemIndex].quantity <= 0) {
      return this.removeItem(product._id, color, size);
    }
  } else {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0 to add an item.');
    }
    this.items.push({ product, quantity, color, size, price });
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
  
  if (this.items.length === 0) {
    await this.remove();  // اگر سبد خرید خالی شد، آن را حذف کنید
  } else {
    await this.save();
  }
};

// روش نمونه برای محاسبه مجموع قیمت‌ها
cartSchema.methods.calculateTotal = async function() {
  const total = await this.populate('items.product')
    .execPopulate()
    .then(cart => {
      return cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    });

  return total;
};

// روش نمونه برای نمایش سبد خرید به کاربر
cartSchema.methods.displayCart = async function() {
  const cart = await this.populate('items.product', 'name price')
    .execPopulate();
  
  return cart.items.map(item => ({
    name: item.product.name,
    price: item.price,
    color: item.color,
    size: item.size,
    quantity: item.quantity,
    total: item.price * item.quantity
  }));
};

// ایجاد مدل سبد خرید و صادر کردن آن
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
