export async function post({ cookies }) {
  // Clear the auth cookie
  cookies.delete('auth_token', { path: '/' });
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Logged out successfully' 
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}