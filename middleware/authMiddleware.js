const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateUser = async (context) => {
  const { req } = context;
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { authenticateUser }; 