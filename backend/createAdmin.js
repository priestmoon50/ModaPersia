require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin.js'); // Ensure the path is correct

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Create the new admin user
        const admin = new Admin({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,  // بدون نیاز به هش کردن دستی، زیرا مدل Admin از قبل دارای hook `pre-save` برای هش کردن است
            isAdmin: true,
        });

        await admin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    }
};

createAdmin();
