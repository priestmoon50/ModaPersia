const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Admin = require("../models/Admin");
const logRequest = require("../utils/logRequest");

// Middleware for protecting user routes
const protectUser = asyncHandler(async (req, res, next) => {
  logRequest("Protect User Middleware Hit", { path: req.path, method: req.method });

  const token = req.headers.authorization?.startsWith('Bearer') 
    ? req.headers.authorization.split(" ")[1] 
    : null;

  if (!token) {
    logRequest("No Token Provided", { path: req.path, method: req.method });
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logRequest("Token Decoded", { decoded });

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      logRequest("User Not Found After Decoding Token", { userId: decoded.id });
      return res.status(401).json({ message: "User not found" });
    }

    logRequest("User Fetched from Database Successfully", { user: req.user });
    next();
  } catch (error) {
    logRequest("Token Verification Failed", { error: error.message });
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
});

// Middleware for protecting admin routes
const protectAdmin = asyncHandler(async (req, res, next) => {
  logRequest("Protect Admin Middleware Hit", { path: req.path, method: req.method });

  const token = req.headers.authorization?.startsWith('Bearer') 
    ? req.headers.authorization.split(" ")[1] 
    : null;

  if (!token) {
    logRequest("No Token Provided", { path: req.path, method: req.method });
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logRequest("Token Decoded", { decoded });

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin || !admin.isAdmin) {
      logRequest("Admin Not Found or Not Admin", { adminId: decoded.id });
      return res.status(401).json({ message: "Admin not found or not authorized" });
    }

    req.admin = admin;
    logRequest("Admin Fetched from Database Successfully", { admin: req.admin });
    next();
  } catch (error) {
    logRequest("Token Verification Failed", { error: error.message });
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
});

// Middleware to verify if the user is an admin
const isAdmin = (req, res, next) => {
  logRequest("Is Admin Middleware Hit", { path: req.path, method: req.method });

  if (req.admin?.isAdmin) {
    logRequest("Admin Verified", { admin: req.admin });
    next();
  } else {
    logRequest("Access Denied: Not Admin", { path: req.path, method: req.method });
    res.status(403).json({ message: "Access denied, admin only" });
  }
};

module.exports = { protectUser, protectAdmin, isAdmin };
