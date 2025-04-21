import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    
    return json(users);
  } catch (error) {
    return json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const { name, email, password } = await request.json();
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password // In a real app, you should hash this password
      }
    });
    
    return json({ id: user.id, name: user.name, email: user.email }, { status: 201 });
  } catch (error) {
    return json({ error: 'Failed to create user' }, { status: 500 });
  }
}