import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../prisma.js';

// No longer need file-based storage functions

export async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email }
  });
}

export async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id }
  });
}

export async function createUser(userData) {
  // Check if user already exists
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  // Create new user in database
  const newUser = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: hashedPassword
    }
  });
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function validateUser(email, password) {
  const user = await findUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Verify a user's password
 * @param {Object} user - User object
 * @param {string} password - Password to verify
 * @returns {Promise<boolean>} True if password matches
 */
export async function verifyPassword(user, password) {
  if (!user || !password) return false;
  
  try {
    // Compare the provided password with the stored hash
    return await bcrypt.compare(password, user.password);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}