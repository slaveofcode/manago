import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;