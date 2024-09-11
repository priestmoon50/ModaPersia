const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/Product");

// Helper function for error handling
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

// @desc Add item to cart
// @route POST /api/cart
// @access Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, color, size } = req.body;
  const userId = req.user ? req.user._id : req.body.user;

  // بررسی ورودی‌های الزامی
  if (!productId || !quantity || quantity <= 0 || !color || !size) {
    return handleError(res, 400, "اطلاعات محصول معتبر نیست");
  }

  // بررسی معتبر بودن productId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return handleError(res, 400, `شناسه محصول معتبر نیست: ${productId}`);
  }

  // شروع تراکنش
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // بررسی وجود محصول و موجودی آن
    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return handleError(res, 404, "محصول یافت نشد");
    }

    // بررسی موجودی محصول
    if (product.stock < quantity) {
      await session.abortTransaction();
      session.endSession();
      return handleError(res, 400, "موجودی کافی نیست");
    }

    // محاسبه قیمت نهایی بر اساس قیمت محصول و تخفیف
    const discount = product.discount || 0;
    const finalPrice = product.price * (1 - discount / 100);
    const totalPrice = finalPrice * quantity;

    // ساخت آیتم سبد خرید
    const cartItem = {
      product: productId,
      quantity,
      color,
      size,
      price: product.price, // قیمت اصلی
      discount, // درصد تخفیف
      finalPrice, // قیمت نهایی با تخفیف
      totalPrice, // مجموع قیمت برای تعداد مشخصی از محصول
    };

    // پیدا کردن یا ساختن سبد خرید
    let cart = await Cart.findOne({ user: userId }).session(session);

    if (cart) {
      // بررسی وجود آیتم مشابه در سبد خرید
      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === productId &&
          item.color === color &&
          item.size === size
      );

      if (existingItem) {
        // به‌روزرسانی تعداد و قیمت کل آیتم موجود
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          await session.abortTransaction();
          session.endSession();
          return handleError(res, 400, "موجودی کافی برای این تعداد وجود ندارد");
        }

        existingItem.quantity = newQuantity;
        existingItem.totalPrice = newQuantity * (existingItem.finalPrice || existingItem.price);
      } else {
        // اضافه کردن آیتم جدید به سبد خرید
        cart.items.push(cartItem);
      }
    } else {
      // ساختن سبد خرید جدید
      cart = new Cart({
        user: userId,
        items: [cartItem],
      });
    }

    await cart.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json(cart);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return handleError(res, 500, "خطایی در سرور رخ داد");
  }
});

// @desc Get cart items
// @route GET /api/cart
// @access Private
const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : req.body.user;

  try {
    // پیدا کردن سبد خرید و جمع آوری اطلاعات محصولات
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price"
    );

    if (!cart) {
      return handleError(res, 404, "سبد خرید پیدا نشد");
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "خطایی در سرور رخ داد");
  }
});

// @desc Remove item from cart
// @route DELETE /api/cart/:id
// @access Private
const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : req.body.user;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return handleError(res, 404, "سبد خرید پیدا نشد");
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === req.params.id
    );

    if (itemIndex === -1) {
      return handleError(res, 404, "آیتم در سبد خرید پیدا نشد");
    }

    // حذف آیتم از سبد خرید
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "خطایی در سرور رخ داد");
  }
});

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
};
