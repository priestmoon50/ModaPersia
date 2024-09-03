const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html = null) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: `"Your Name" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      text,
      html: html || text, // اگر HTML داده نشده باشد، از متن ساده استفاده می‌شود
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
