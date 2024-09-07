const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const generateUserToken = (user) => {
  // بررسی وجود کاربر و شناسه معتبر
  if (!user || !user._id) {
    throw new Error('User object with a valid _id is required to generate a token');
  }

  if (!mongoose.Types.ObjectId.isValid(user._id)) {
    throw new Error(`Invalid ObjectId: ${user._id}`);
  }

  // بررسی وجود JWT_SECRET در محیط
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const payload = {
    id: user._id.toString(),
    email: user.email || '',
    isAdmin: user.isAdmin || false,
    iat: Math.floor(Date.now() / 1000), // زمان صدور توکن
  };

  try {
    // تولید توکن
    return jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'HS512',  // انتخاب الگوریتم امن‌تر
      expiresIn: '7d',     // زمان انقضای توکن
    });
  } catch (error) {
    throw new Error(`Error generating token: ${error.message}`);
  }
};

module.exports = { generateUserToken };
