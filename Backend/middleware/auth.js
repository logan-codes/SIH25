import { verifyToken } from '../utils/jwt.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

    if (!token) {
      return res.status(401).json({ message: 'Access token not found' });
    }

    const { valid, decoded, error } = verifyToken(token);

    if (!valid) {
      return res.status(403).json({ message: 'Invalid or expired token', error });
    }

    // Add user data to request object
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

// Optional: Middleware to check specific roles if needed
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};