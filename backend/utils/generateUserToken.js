const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const generateUserToken = (user) => {
  if (!user || !user._id) {
    throw new Error('User object with a valid _id is required to generate a token');
  }

  if (!mongoose.Types.ObjectId.isValid(user._id)) {
    throw new Error('Invalid ObjectId');
  }

  const payload = {
    id: user._id.toString(),
    email: user.email || '',
    isAdmin: user.isAdmin || false,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS512',
    expiresIn: '7d'
  });
};

module.exports = { generateUserToken };
