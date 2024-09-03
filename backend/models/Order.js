const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {  // از نوع ObjectId مرتبط با مدل Product
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID is required"],
    index: true,
  },
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  image: {
    type: String,
    required: [true, "Image URL is required"],
    trim: true,
  },
}, {
  timestamps: true,
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
    index: true,
  },
  orderItems: {
    type: [orderItemSchema],
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "Order must contain at least one item",
    },
  },
  shippingAddress: {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [2, "City name must be at least 2 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters"],
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{5}(-\d{4})?$/.test(v);
        },
        message: (props) => `${props.value} is not a valid postal code!`,
      },
    },
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  itemsPrice: {
    type: Number,
    required: [true, "Items price is required"],
    min: [0, "Items price cannot be negative"],
  },
  taxPrice: {
    type: Number,
    required: [true, "Tax price is required"],
    min: [0, "Tax price cannot be negative"],
  },
  shippingPrice: {
    type: Number,
    required: [true, "Shipping price is required"],
    min: [0, "Shipping price cannot be negative"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
    min: [0, "Total price cannot be negative"],
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: { type: Date },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: { type: Date },
}, {
  timestamps: true,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
