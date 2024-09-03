const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const logRequest = require("../utils/logRequest"); // فرض می‌کنیم این تابع لاگ ریکوئست شماست

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password if modified
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    logRequest("Hashing Admin Password", { adminId: this._id });
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    logRequest("Password Hashed Successfully", { adminId: this._id });
    next();
  } catch (err) {
    logRequest("Error Hashing Password", { adminId: this._id, error: err.message });
    next(err);
  }
});

// Method to compare entered password with hashed password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  logRequest("Comparing Password", { adminId: this._id });
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  logRequest("Password Comparison Result", { adminId: this._id, isMatch });
  return isMatch;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
