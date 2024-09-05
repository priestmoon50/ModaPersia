const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/Product");

// @desc Add item to cart
// @route POST /api/cart
// @access Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, color, size } = req.body;

  // بررسی ورودی‌های الزامی
  if (!productId || !quantity || quantity <= 0 || !color || !size) {
    return res.status(400).json({ message: "اطلاعات محصول معتبر نیست" });
  }

  // بررسی معتبر بودن productId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Product ID is invalid" });
  }

  const userId = req.user ? req.user._id : req.body.user;

  // بررسی وجود محصول و موجودی آن
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "محصول یافت نشد" });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ message: "موجودی کافی نیست" });
  }

  // محاسبه قیمت نهایی بر اساس قیمت محصول یا تخفیف
  const cartItem = {
    product: productId,
    quantity,
    color,
    size,
    price: product.price,
    discountPrice: product.discountPrice || product.price,
    totalPrice: (product.discountPrice || product.price) * quantity,
  };

  // پیدا کردن یا ساختن سبد خرید
  let cart = await Cart.findOne({ user: userId });

  if (cart) {
    // چک کردن اینکه آیتم در سبد خرید هست یا نه
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (existingItem) {
      // بررسی موجودی برای جلوگیری از افزایش بیش از حد تعداد
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res
          .status(400)
          .json({ message: "موجودی کافی برای افزایش این تعداد وجود ندارد" });
      }
      // به‌روزرسانی تعداد و قیمت کل
      existingItem.quantity = newQuantity;
      existingItem.totalPrice =
        existingItem.quantity *
        (existingItem.discountPrice || existingItem.price);
    } else {
      // اضافه کردن آیتم جدید به سبد خرید
      cart.items.push(cartItem);
    }

    await cart.save();
    res.status(200).json(cart);
  } else {
    // ساختن سبد خرید جدید برای کاربر
    cart = await Cart.create({
      user: userId,
      items: [cartItem],
    });

    res.status(201).json(cart);
  }
});

// @desc Get cart items
// @route GET /api/cart
// @access Private
const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : req.body.user;

  // پیدا کردن سبد خرید و جمع آوری اطلاعات محصولات
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price"
  );

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ message: "سبد خرید پیدا نشد" });
  }
});

// @desc Remove item from cart
// @route DELETE /api/cart/:id
// @access Private
const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : req.body.user;

  const cart = await Cart.findOne({ user: userId });

  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === req.params.id
    );

    if (itemIndex > -1) {
      // حذف آیتم از سبد خرید
      cart.items.splice(itemIndex, 1);
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "آیتم در سبد خرید پیدا نشد" });
    }
  } else {
    res.status(404).json({ message: "سبد خرید پیدا نشد" });
  }
});

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
};
