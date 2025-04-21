// Mark this endpoint as server-rendered (not prerendered/static)
export const prerender = false;

// Handle POST requests
export async function POST({ cookies }) {
  // Clear the auth cookie
  cookies.delete('auth_token', { path: '/' });
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Logged out successfully' 
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}