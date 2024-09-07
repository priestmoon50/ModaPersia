const asyncHandler = require("express-async-handler");
const UserAddress = require("../models/UserAddress");
const logRequest = require("../utils/logRequest");
const { body, validationResult } = require('express-validator');

// @desc    Add a new address for a user
// @route   POST /api/users/:userId/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  // Ensure the user is adding an address to their own account
  if (req.user._id.toString() !== req.params.userId) {
    return res.status(403).json({ message: "Unauthorized to add address to this account" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  logRequest("Add Address Request", {
    userId: req.user._id,
    body: req.body,
  });

  const { address, city, postalCode, country, phoneNumber } = req.body;

  const newAddress = new UserAddress({
    user: req.user._id,
    address,
    city,
    postalCode,
    country,
    phoneNumber,
  });

  const savedAddress = await newAddress.save();
  logRequest("Address Saved", { savedAddress });

  res.status(201).json(savedAddress);
});

// @desc    Get all addresses for a user
// @route   GET /api/users/:userId/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  if (req.user._id.toString() !== req.params.userId) {
    return res.status(403).json({ message: "Unauthorized to view addresses for this account" });
  }

  logRequest("Get Addresses Request", {
    userId: req.user._id,
  });

  const addresses = await UserAddress.find({ user: req.user._id });
  logRequest("Addresses Fetched", { addresses });

  res.json(addresses);
});

module.exports = {
  addAddress,
  getAddresses,
};
