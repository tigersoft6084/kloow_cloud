const jwt = require('jsonwebtoken');

const JWT_SECRET = 'proxyservicejwttoken';
const JWT_REFRESH_SECRET = 'proxyservicejwtrefreshtoken';

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'No access token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired access token' });
  }
};

module.exports = { verifyToken, JWT_SECRET, JWT_REFRESH_SECRET };
