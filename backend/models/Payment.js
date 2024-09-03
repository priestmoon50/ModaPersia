const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required'],
  },
  method: {
    type: String,
    required: [true, 'Payment method is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount must be positive'],
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
    card: {
      brand: String,
      country: String,
      last4: String,
      exp_month: Number,
      exp_year: Number,
    },
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Auto-update `paidAt` when `isPaid` is set to true
paymentSchema.pre('save', function(next) {
  if (this.isPaid && !this.paidAt) {
    this.paidAt = new Date();
  }
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
