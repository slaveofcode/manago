// Mark this endpoint as server-rendered (not prerendered/static)
export const prerender = false;

// Handle GET requests - Get all integrations for the current user
export async function GET({ locals }) {
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
    
    // Import integration model
    const { getUserIntegrations } = await import('../../../lib/models/integration.js');
    
    // Get integrations for the current user
    const integrations = await getUserIntegrations(locals.user.id);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: integrations 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching integrations:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to fetch integrations: ' + (error.message || 'Unknown error') 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle POST requests - Create a new integration
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
    const data = await request.json();
    const { type, name, config } = data;
    
    // Validate input
    if (!type || !name) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Type and name are required' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Import integration model
    const { createIntegration, getIntegrationByType } = await import('../../../lib/models/integration.js');
    
    // Check if integration of this type already exists for the user
    const existingIntegration = await getIntegrationByType(locals.user.id, type);
    if (existingIntegration) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `A ${type} integration already exists` 
        }),
        { 
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create integration
    const integration = await createIntegration({
      type,
      name,
      config,
      userId: locals.user.id
    });
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: integration,
        message: 'Integration created successfully' 
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error creating integration:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to create integration: ' + (error.message || 'Unknown error') 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}