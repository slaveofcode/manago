import jwt from 'jsonwebtoken';

// Use a secure secret key (ideally from environment variables)
const JWT_SECRET = import.meta.env.JWT_SECRET || 'your-secret-key';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
export function generateToken(user) {
  // Create a payload with user info (don't include sensitive data like password)
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  
  // Sign the token with a secret key and set expiration
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} User payload or null if invalid
 */
export async function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}