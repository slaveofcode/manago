import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

// In a real app, you'd use a proper database
// This is a simple file-based storage for demonstration
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure the data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Load users from file
async function loadUsers() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet, return empty array
      return [];
    }
    throw error;
  }
}

// Save users to file
async function saveUsers(users) {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function findUserByEmail(email) {
  const users = await loadUsers();
  return users.find(user => user.email === email) || null;
}

export async function findUserById(id) {
  const users = await loadUsers();
  return users.find(user => user.id === id) || null;
}

export async function createUser(userData) {
  const users = await loadUsers();
  
  // Check if user already exists
  if (users.some(user => user.email === userData.email)) {
    throw new Error('User with this email already exists');
  }
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  // Create new user
  const newUser = {
    id: uuidv4(),
    email: userData.email,
    name: userData.name,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  // Add to users array and save
  users.push(newUser);
  await saveUsers(users);
  
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