const express = require("express");
const asyncHandler = require("express-async-handler");
const { protectUser } = require("../middlewares/auth"); // استفاده از protectUser از auth.js
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// Middleware for validating productId input
const validateProductId = [
  check('productId')
    .isMongoId().withMessage('Invalid product ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Add item to favorites
router.post("/", protectUser, validateProductId, asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let favorite = await Favorite.findOne({ user });

  if (!favorite) {
    favorite = new Favorite({ user, items: [productId] });
  } else {
    if (favorite.items.includes(productId)) {
      return res.status(400).json({ message: "Product already in favorites" });
    }
    favorite.items.push(productId);
  }

  await favorite.save();
  res.status(201).json(favorite);
}));

// Remove item from favorites
router.delete("/:productId", protectUser, validateProductId, asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { productId } = req.params;

  const favorite = await Favorite.findOne({ user });

  if (favorite && favorite.items.includes(productId)) {
    favorite.items = favorite.items.filter(item => item.toString() !== productId);
    await favorite.save();
    res.status(200).json({ message: "Product removed from favorites" });
  } else {
    res.status(404).json({ message: "Product not found in favorites" });
  }
}));

// Get user's favorites
router.get("/", protectUser, asyncHandler(async (req, res) => {
  const user = req.user._id;

  const favorite = await Favorite.findOne({ user }).populate("items");
  if (!favorite) {
    return res.status(404).json({ message: "No favorites found" });
  }

  res.json(favorite);
}));

module.exports = router;
