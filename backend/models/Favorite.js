const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // فرض بر این است که محصولات علاقه‌مندی‌ها از مدل Product هستند
      required: true,
    },
  ],
}, {
  timestamps: true,
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
