// Mark this endpoint as server-rendered (not prerendered/static)
export const prerender = false;

// Handle POST requests
export async function POST({ request }) {
  try {
    const data = await request.json();
    const { name, email, password } = data;
    
    // Validate input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Name, email, and password are required' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Import user model
    const { createUser, findUserByEmail } = await import('../../../lib/models/user.js');
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'User with this email already exists' 
        }),
        { 
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create new user
    const user = await createUser({ name, email, password });
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User registered successfully' 
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Registration failed: ' + (error.message || 'Unknown error') 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}