const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle both user and admin tokens
    if (decoded.user) {
      req.user = decoded.user;
    } else if (decoded.admin) {
      req.user = decoded.admin; // Use req.user for consistency
    } else {
      return res.status(401).json({ msg: 'Invalid token structure' });
    }
    
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth; 