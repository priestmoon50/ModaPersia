const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const { generateAdminToken } = require('../utils/generateAdminToken');
const logRequest = require('../utils/logRequest'); // اضافه کردن logRequest

// @desc Admin login & get token
// @route POST /api/auth/admin/login
// @access Public
const adminLogin = asyncHandler(async (req, res) => {
  logRequest("Admin Login Route Hit", req);

  const { email, password } = req.body;

  try {
    // Verify admin email and password
    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const adminToken = generateAdminToken(admin);
      logRequest("Admin Login Successful", req, { adminId: admin._id });

      res.json({
        message: 'Admin login successful',
        token: adminToken,
      });
    } else {
      logRequest("Invalid Credentials", req, { email });
      res.status(401).json({ message: 'Not authorized as an admin' });
    }
  } catch (error) {
    logRequest("Admin Login Failed", req, { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = { adminLogin };
