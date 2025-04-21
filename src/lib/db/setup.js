import prisma from '../prisma.js';

export async function setupDatabase() {
  try {
    // Test the connection
    await prisma.$connect();
    console.log('Database connection established');
    
    // You can add seed data here if needed
    
    return { success: true };
  } catch (error) {
    console.error('Database setup failed:', error);
    return { success: false, error };
  }
}