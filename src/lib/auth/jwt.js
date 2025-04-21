import jwt from 'jsonwebtoken';

// Secret key for JWT signing - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Token expiration time (e.g., 7 days)
const EXPIRES_IN = '7d';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User data to encode in the token
 * @returns {string} JWT token
 */
export function generateToken(user) {
  // Don't include sensitive information like password in the token
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded user data or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}