require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes"); // مسیری که فایل productRoutes.js در آن قرار دارد
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const userAddressRoutes = require("./routes/userAddressRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");

const app = express();

// Setting up CORS
// const corsOptions = {
//   origin: "http://localhost:3000", // Allow requests from this specific origin
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS" ,],
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "Accept",
//     "X-Requested-With",
//   ],
//   credentials: true,
// };

// const corsOptions = {
//   origin: "*", // Allow requests from this specific origin
//   methods: "*",
//   allowedHeaders: "*",
//   credentials: true,
// };

// app.use(cors(corsOptions));

app.use(cors());

// استفاده از compression برای بهبود عملکرد
app.use(compression());

// تنظیمات helmet برای امنیت بیشتر
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://js.stripe.com/v3"],
        connectSrc: ["'self'", "http://localhost:3000", "http://localhost:5000", "https://api.stripe.com"],
        imgSrc: ["'self'", "data:", "blob:", "http://localhost:3000", "http://localhost:5000/uploads"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        frameSrc: ["'self'", "https://js.stripe.com"],
        frameAncestors: ["'self'"],
      },
    },
    xssFilter: true,
    noSniff: true,
    ieNoOpen: true,
    dnsPrefetchControl: { allow: false },
  })
);

// محدود کردن تعداد درخواست‌ها (در محیط توسعه می‌توانید آن را غیرفعال کنید)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 100, // حداکثر 100 درخواست در هر 15 دقیقه از یک IP
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// اتصال به MongoDB
connectDB();

app.use(express.json());

// Stripe payment route with validation
app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid payment amount" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ message: "Payment processing failed, please try again" });
  }
});

// مسیرهای مختلف
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/addresses", userAddressRoutes);
app.use("/api/stripe", stripeRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// مدیریت مسیرهای نادرست
app.use("*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Middleware مدیریت خطاها
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
