const nodemailer = require('nodemailer');

// تنظیمات SMTP برای ارسال ایمیل با استفاده از متغیرهای محیطی
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

// تابع ارسال هشدار موجودی پایین
const sendLowStockAlert = async (product) => {
  const mailOptions = {
    from: `"Inventory Alert" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Low Stock Alert for ${product.name}`,
    text: `The stock for product "${product.name}" is low. Only ${product.stock} items left.`,
    html: `<p>The stock for product "<strong>${product.name}</strong>" is low. Only <strong>${product.stock}</strong> items left.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Low stock alert sent for product: ${product.name}`);
  } catch (error) {
    console.error('Error sending low stock alert:', error);
    // Log additional details or take further action here if needed
  }
};

module.exports = {
  sendLowStockAlert,
};
