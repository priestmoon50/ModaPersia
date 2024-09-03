const Admin = require('../models/Admin');
const logRequest = require('../utils/logRequest');

exports.createAdmin = async (req, res) => {
  logRequest("Create Admin Route Hit", req);
  
  try {
    const { email, password } = req.body;

    // بررسی وجود ادمین با ایمیل مشابه
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      logRequest("Admin Already Exists", req, { email });
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // ایجاد ادمین جدید با رمز عبور
    const admin = new Admin({
      email,
      password, // مدل ادمین از قبل دارای hook `pre-save` برای هش کردن رمز عبور است
    });

    // ذخیره در پایگاه داده
    await admin.save();
    logRequest("Admin Created Successfully", req, { adminId: admin._id });

    res.status(201).json({ message: 'Admin created successfully', adminId: admin._id });
  } catch (error) {
    logRequest("Error Creating Admin", req, { error: error.message });
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
