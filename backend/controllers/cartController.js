const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/Product');

// @desc Add item to cart
// @route POST /api/cart
// @access Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, color, size } = req.body;

  if (!productId || !quantity || quantity <= 0 || !color || !size) {
    return res.status(400).json({ message: "Invalid product details" });
  }

  const userId = req.user ? req.user._id : req.body.user;

  // بررسی موجودی کالا قبل از اضافه کردن به سبد خرید
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ message: "Not enough stock available" });
  }

  const cartItem = {
    product: productId,
    quantity,
    color,
    size,
    price: product.price,
    discountPrice: product.discountPrice,
    totalPrice: (product.discountPrice || product.price) * quantity
  };

  const cart = await Cart.findOne({ user: userId });

  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.color === color && item.size === size
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].totalPrice = cart.items[itemIndex].quantity * (cart.items[itemIndex].discountPrice || cart.items[itemIndex].price);
    } else {
      cart.items.push(cartItem);
    }

    await cart.save();
    res.status(200).json(cart);
  } else {
    const newCart = await Cart.create({
      user: userId,
      items: [cartItem]
    });

    res.status(201).json(newCart);
  }
});

// @desc Get cart items
// @route GET /api/cart
// @access Private
const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : req.body.user;

  const cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Cart not found' });
  }
});

// @desc Remove item from cart
// @route DELETE /api/cart/:id
// @access Private
const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : req.body.user;

  const cart = await Cart.findOne({ user: userId });

  if (cart) {
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === req.params.id);

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } else {
    res.status(404).json({ message: 'Cart not found' });
  }
});

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
};
