// Mark this endpoint as server-rendered (not prerendered/static)
export const prerender = false;

// Handle GET requests - Get a specific integration
export async function GET({ params, locals }) {
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
    
    const { id } = params;
    
    // Import integration model
    const { getIntegrationById } = await import('../../../lib/models/integration.js');
    
    // Get integration
    const integration = await getIntegrationById(id);
    
    // Check if integration exists
    if (!integration) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Integration not found' 
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Check if integration belongs to the current user
    if (integration.userId !== locals.user.id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: integration 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching integration:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to fetch integration: ' + (error.message || 'Unknown error') 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle PUT requests - Update an integration
export async function PUT({ request, params, locals }) {
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
    
    const { id } = params;
    
    // Parse request body
    const data = await request.json();
    const { name, config, enabled } = data;
    
    // Import integration model
    const { getIntegrationById, updateIntegration } = await import('../../../lib/models/integration.js');
    
    // Get integration
    const integration = await getIntegrationById(id);
    
    // Check if integration exists
    if (!integration) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Integration not found' 
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Check if integration belongs to the current user
    if (integration.userId !== locals.user.id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Update integration
    const updatedIntegration = await updateIntegration(id, {
      name: name !== undefined ? name : integration.name,
      config: config !== undefined ? config : integration.config,
      enabled: enabled !== undefined ? enabled : integration.enabled
    });
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: updatedIntegration,
        message: 'Integration updated successfully' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error updating integration:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to update integration: ' + (error.message || 'Unknown error') 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle DELETE requests - Delete an integration
export async function DELETE({ params, locals }) {
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
    
    const { id } = params;
    
    // Import integration model
    const { getIntegrationById, deleteIntegration } = await import('../../../lib/models/integration.js');
    
    // Get integration
    const integration = await getIntegrationById(id);
    
    // Check if integration exists
    if (!integration) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Integration not found' 
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Check if integration belongs to the current user
    if (integration.userId !== locals.user.id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Delete integration
    await deleteIntegration(id);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Integration deleted successfully' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error deleting integration:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to delete integration: ' + (error.message || 'Unknown error') 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}