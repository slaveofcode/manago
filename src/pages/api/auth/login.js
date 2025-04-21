// Mark this endpoint as server-rendered (not prerendered/static)
export const prerender = false;

// Handle POST requests
export async function POST({ request, cookies }) {
  try {
    const data = await request.json();
    const { email, password } = data;
    
    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Email and password are required' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Import user model
    const { findUserByEmail, verifyPassword } = await import('../../../lib/models/user.js');
    
    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid email or password' 
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(user, password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid email or password' 
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Import JWT utilities
    const { generateToken } = await import('../../../lib/auth/jwt.js');
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Set auth cookie
    cookies.set('auth_token', token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD, // Secure in production
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Login successful' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Login failed: ' + (error.message || 'Unknown error') 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}