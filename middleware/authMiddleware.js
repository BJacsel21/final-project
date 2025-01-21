const jwt = require('jsonwebtoken');

const authenticateUser = async (context) => {
  const { req } = context;
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { authenticateUser }; 