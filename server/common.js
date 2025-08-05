const jwt = require('jsonwebtoken');

const JWT_SECRET = 'proxyservicejwttoken';
const JWT_REFRESH_SECRET = 'proxyservicejwtrefreshtoken';

// Updated verifyToken middleware to check Authorization header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken, JWT_SECRET, JWT_REFRESH_SECRET };
