const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUser = async (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    return null;
  }
};

module.exports = { getUser }; 