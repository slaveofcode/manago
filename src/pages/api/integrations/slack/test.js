// Mark this endpoint as server-rendered (not prerendered/static)
export const prerender = false;

// Handle POST requests - Test Slack integration
export async function POST({ request, locals }) {
  try {
    // Check if user is authenticated
    if (!locals.user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Authentication required' 
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Parse request body
    const config = await request.json();
    
    // Import Slack utilities
    const { testSlackConfig } = await import('../../../../lib/integrations/slack.js');
    
    // Test Slack configuration
    const result = await testSlackConfig(config);
    
    // Return response
    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error testing Slack integration:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to test Slack integration: ' + (error.message || 'Unknown error') 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}