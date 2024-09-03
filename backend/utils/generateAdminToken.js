const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const logRequest = require('../utils/logRequest'); // فرض می‌کنیم این تابع لاگ ریکوئست شماست

const generateAdminToken = (admin) => {
  logRequest("Generating Admin Token", { adminId: admin._id }); // اضافه کردن لاگ

  if (!admin || !admin._id) {
    const errorMsg = 'Admin object with a valid _id is required to generate a token';
    logRequest("Error in Generating Token", { error: errorMsg });
    throw new Error(errorMsg);
  }

  if (!mongoose.Types.ObjectId.isValid(admin._id)) {
    const errorMsg = 'Invalid ObjectId';
    logRequest("Error in Generating Token", { error: errorMsg });
    throw new Error(errorMsg);
  }

  const payload = {
    id: admin._id.toString(),
    email: admin.email || '',
    isAdmin: true, // اطمینان از اینکه این توکن برای ادمین تولید شده است
  };

  logRequest("Admin Token Payload Created", { payload }); // اضافه کردن لاگ

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS512',
    expiresIn: '2d', // Token will expire in 2 days
  });

  logRequest("Admin Token Generated", { token }); // اضافه کردن لاگ

  return token;
};

module.exports = { generateAdminToken };
