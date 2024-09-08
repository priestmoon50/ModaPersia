const asyncHandler = require("express-async-handler");
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");

// @desc    Get user's favorite products
// @route   GET /api/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOne({ user: req.user._id }).populate("items");
  if (favorite) {
    res.json(favorite.items);
  } else {
    res.status(404).json({ message: "No favorites found" });
  }
});


// @desc    Add product to favorites
// @route   POST /api/favorites
// @access  Private
const addFavorite = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    let favorite = await Favorite.findOne({ user: req.user._id });

    if (!favorite) {
      favorite = new Favorite({ user: req.user._id, items: [productId] });
    } else {
      if (favorite.items.includes(productId)) {
        return res.status(400).json({ message: "Product already in favorites" });
      }
      favorite.items.push(productId);
    }

    await favorite.save();
    res.status(201).json({ message: "Product added to favorites", favorite });
  } catch (error) {
    res.status(500).json({ message: "Failed to add favorite" });
  }
});

// @desc    Remove product from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
const removeFavorite = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const favorite = await Favorite.findOne({ user: req.user._id });

    if (!favorite || !favorite.items.includes(productId)) {
      return res.status(404).json({ message: "Product not found in favorites" });
    }

    favorite.items = favorite.items.filter(id => id.toString() !== productId);
    await favorite.save();

    res.json({ message: "Product removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
});

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
