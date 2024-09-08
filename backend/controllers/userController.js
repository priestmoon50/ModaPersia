const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateUserToken } = require("../utils/generateUserToken");
const { body, validationResult } = require('express-validator');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password, // Hashing is handled by the User model
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateUserToken(user), // Generating JWT token
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateUserToken(user), // Generating JWT token
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// @desc    Get user profile
// @route   GET /api/users/:userId/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user._id.toString() !== req.params.userId) {
    return res.status(403).json({ message: "Unauthorized access to user profile" });
  }

  const user = await User.findById(req.params.userId);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


// @desc    Update user profile
// @route   PUT /api/users/:userId/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // بررسی اینکه آیا کاربر اجازه به‌روزرسانی دارد یا خیر
  if (req.user._id.toString() !== req.params.userId) {
    return res.status(403).json({ message: "Unauthorized access to user profile" });
  }

  const user = await User.findById(req.params.userId);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    // به‌روزرسانی رمز عبور در صورت موجود بودن
    if (req.body.password) {
      user.password = req.body.password;
    }

    // ذخیره کاربر به‌روزشده
    const updatedUser = await user.save();

    // ارسال پاسخ موفقیت‌آمیز به کلاینت
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      isAdmin: updatedUser.isAdmin,
      token: generateUserToken(updatedUser), // ارسال توکن جدید
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});





module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile, 
};
