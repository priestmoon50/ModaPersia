const express = require("express");
const { addAddress, getAddresses } = require("../controllers/userAddressController");
const { protectUser } = require("../middlewares/auth");
const asyncHandler = require("express-async-handler");
const { param, validationResult } = require("express-validator");
const logRequest = require("../utils/logRequest");

const router = express.Router();

// میدلور مستقل برای اعتبارسنجی userId
const validateUserId = param("userId").isMongoId().withMessage("Invalid user ID");

// اضافه کردن لاگر در ابتدای هر درخواست
router.use((req, res, next) => {
    logRequest("Request received for address routes", req);
    next();
});

router.post(
  "/:userId/addresses",
  protectUser,
  validateUserId,
  asyncHandler(async (req, res) => {
    logRequest("Add User Address Route Hit", req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const address = await addAddress(req, res);
      return res.status(201).json(address);
    } catch (error) {
      console.error("Error adding address:", error);
      return res.status(500).json({ message: "Server error adding address", error: error.message });
    }
  })
);

router.get(
  "/:userId/addresses",
  protectUser,
  validateUserId,
  asyncHandler(async (req, res) => {
    logRequest("Get User Addresses Route Hit", req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const addresses = await getAddresses(req, res);
      return res.json(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return res.status(500).json({ message: "Server error fetching addresses", error: error.message });
    }
  })
);

module.exports = router;
