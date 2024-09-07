const express = require("express");
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protectUser } = require("../middlewares/auth"); // Ensure this middleware is correct
const asyncHandler = require("express-async-handler");
const { body, validationResult, param } = require("express-validator");
const logRequest = require("../utils/logRequest");

const router = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logRequest("Validation Error", req, { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }
  logRequest("Validation Passed", req);
  next();
};

// User registration route
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    logRequest("Register User Route Hit", req);
    try {
      const user = await registerUser(req, res);
      logRequest("User Registered", { user });
      return res.status(201).json(user);
    } catch (error) {
      logRequest("Error during registration", req, { error: error.message });
      return res.status(500).json({
        message: "Server error during registration",
        error: error.message,
      });
    }
  })
);

// User login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    logRequest("Login User Route Hit", req);
    try {
      const user = await authUser(req, res);
      logRequest("User Logged In", { user });
      return res.json(user);
    } catch (error) {
      logRequest("Error during login", req, { error: error.message });
      return res
        .status(500)
        .json({ message: "Server error during login", error: error.message });
    }
  })
);

// Get and update user profile routes
router
  .route("/:userId/profile")
  .get(
    protectUser,
    param("userId").isMongoId().withMessage("Invalid user ID"),
    validateRequest,
    asyncHandler(async (req, res) => {
      logRequest("Get User Profile Route Hit", req);
      try {
        const userProfile = await getUserProfile(req, res);
        logRequest("User Profile Fetched", { userProfile });
        return res.json(userProfile);
      } catch (error) {
        logRequest("Error fetching user profile", req, { error: error.message });
        return res.status(500).json({
          message: "Server error fetching user profile",
          error: error.message,
        });
      }
    })
  )
  .put(
    protectUser,
    param("userId").isMongoId().withMessage("Invalid user ID"),
    validateRequest,
    asyncHandler(async (req, res) => {
      logRequest("Update User Profile Route Hit", req);
      try {
        const updatedUser = await updateUserProfile(req, res);
        logRequest("User Profile Updated", { updatedUser });
        return res.json(updatedUser);
      } catch (error) {
        logRequest("Error updating user profile", req, { error: error.message });
        return res.status(500).json({
          message: "Server error updating user profile",
          error: error.message,
        });
      }
    })
  );

module.exports = router;
