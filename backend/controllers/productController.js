const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");

// تعریف رنگ‌ها و سایزهای معتبر
const colorEnum = ["Red", "Blue", "Green", "Yellow", "Black", "White", "Purple", "Orange", "Pink", "Brown"];
const sizeEnum = ["XS", "S", "M", "L", "XL", "XXL"];

// Schema برای ولیدیشن داده‌ها
const productSchema = Joi.object({
  name: Joi.string().required().max(100),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  discountPercentage: Joi.number().min(0).max(100).optional(),
  sizes: Joi.array().items(Joi.string().valid(...sizeEnum)).required(), // ولیدیشن برای سایزهای معتبر
  colors: Joi.array().items(Joi.string().valid(...colorEnum)).required(), // ولیدیشن برای رنگ‌های معتبر
  images: Joi.array().items(Joi.string()).required(),
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = asyncHandler(async (req, res) => {
  // اگر تصاویر آپلود شده وجود دارد، مسیرهای آن‌ها را به `req.body.images` اضافه کنید
  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map(file => `/uploads/${file.filename}`);
  }

  // تبدیل آرایه‌های JSON شده به آرایه‌های معمولی
  req.body.sizes = JSON.parse(req.body.sizes);
  req.body.colors = JSON.parse(req.body.colors);

  const { error } = productSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
  if (error) {
    return res.status(400).json({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
  }

  const { name, description, price, discountPercentage, sizes, colors, images } = req.body;

  const product = new Product({
    name,
    description,
    price,
    discountPercentage,
    sizes,
    colors,
    images
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});



// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, description, price, discountPercentage, sizes, colors } = req.body;

  // ولیدیشن جزئی: فقط اطلاعات ارسالی ولیدیت می‌شوند
  const validationData = {
    name: name !== undefined ? name : product.name,
    description: description !== undefined ? description : product.description,
    price: price !== undefined ? price : product.price,
    discountPercentage: discountPercentage !== undefined ? discountPercentage : product.discountPercentage,
    sizes: sizes !== undefined ? sizes : product.sizes,
    colors: colors !== undefined ? colors : product.colors,
    images: req.files && req.files.length > 0 ? req.files.map(file => `/uploads/${file.filename}`) : product.images,
  };

  const { error } = productSchema.validate(validationData, { abortEarly: false, allowUnknown: true });
  if (error) {
    return res.status(400).json({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
  }

  // به‌روزرسانی اطلاعات محصول با داده‌های جدید
  product.name = name !== undefined ? name : product.name;
  product.description = description !== undefined ? description : product.description;
  product.price = price !== undefined ? price : product.price;
  product.discountPercentage = discountPercentage !== undefined ? discountPercentage : product.discountPercentage;
  product.sizes = sizes !== undefined ? sizes : product.sizes;
  product.colors = colors !== undefined ? colors : product.colors;
  product.images = req.files && req.files.length > 0 ? req.files.map(file => `/uploads/${file.filename}`) : product.images;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});



// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Loop through each image in the product and delete it from the filesystem
  product.images.forEach(imagePath => {
    const fullPath = path.join(__dirname, '..', 'uploads', path.basename(imagePath));

    fs.unlink(fullPath, err => {
      if (err) {
        console.error('Failed to delete image:', err);
      }
    });
  });

  // Finally, delete the product from the database
  await Product.findByIdAndDelete(req.params.id);

  res.json({ message: "Product and associated images removed" });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get a product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});



// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const products = await Product.find({ ...keyword });
  res.json(products);
});


module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  searchProducts,
};
