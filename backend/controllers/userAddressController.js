const asyncHandler = require("express-async-handler");
const UserAddress = require("../models/UserAddress");
const logRequest = require("../utils/logRequest");

// @desc    Add a new address for a user
// @route   POST /api/users/:userId/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  // لاگ ریکوئست برای ثبت اطلاعات درخواست ورودی
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
  // لاگ ریکوئست برای ثبت اطلاعات درخواست ورودی
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
