<script>
  // Props
  export let integration = null;
  
  // Form state
  let name = integration?.name || 'Slack Integration';
  let webhookUrl = integration?.config?.webhookUrl || '';
  let channel = integration?.config?.channel || '#general';
  let username = integration?.config?.username || 'Manago Bot';
  let isSubmitting = false;
  let errors = {};
  let testResult = null;
  let submitSuccess = false;
  
  // Handle form submission
  async function handleSubmit() {
    // Reset errors and test result
    errors = {};
    testResult = null;
    isSubmitting = true;
    
    // Validate form
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!webhookUrl.trim()) {
      errors.webhookUrl = 'Webhook URL is required';
    } else if (!webhookUrl.startsWith('https://hooks.slack.com/')) {
      errors.webhookUrl = 'Invalid Slack webhook URL';
    }
    
    if (!channel.trim()) {
      errors.channel = 'Channel is required';
    } else if (!channel.startsWith('#')) {
      errors.channel = 'Channel must start with #';
    }
    
    // If there are errors, don't submit
    if (Object.keys(errors).length > 0) {
      isSubmitting = false;
      return;
    }
    
    // Prepare data for submission
    const config = {
      webhookUrl,
      channel,
      username
    };
    
    try {
      let url, method;
      
      if (integration) {
        // Update existing integration
        url = `/api/integrations/${integration.id}`;
        method = 'PUT';
      } else {
        // Create new integration
        url = '/api/integrations';
        method = 'POST';
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(integration ? {
          name,
          config
        } : {
          type: 'slack',
          name,
          config
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        submitSuccess = true;
        // Redirect after successful submission
        setTimeout(() => {
          window.location.href = '/dashboard/integrations';
        }, 1500);
      } else {
        errors.submit = result.message || 'Failed to save integration';
      }
    } catch (err) {
      errors.submit = 'Error saving integration: ' + err.message;
    } finally {
      isSubmitting = false;
    }
  }
  
  // Test the Slack integration
  async function testIntegration() {
    isSubmitting = true;
    testResult = null;
    
    try {
      const response = await fetch('/api/integrations/slack/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          webhookUrl,
          channel,
          username
        })
      });
      
      const result = await response.json();
      testResult = result;
    } catch (error) {
      testResult = {
        success: false,
        message: 'Failed to test integration: ' + error.message
      };
    } finally {
      isSubmitting = false;
    }
  }
  
  // Handle cancel
  function handleCancel() {
    window.location.href = '/dashboard/integrations';
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  {#if submitSuccess}
    <div class="p-3 rounded-md bg-green-100 text-green-800">
      Integration {integration ? 'updated' : 'created'} successfully! Redirecting...
    </div>
  {/if}
  
  {#if errors.submit}
    <div class="p-3 rounded-md bg-destructive/10 text-destructive">
      {errors.submit}
    </div>
  {/if}
  
  <!-- Name field -->
  <div class="space-y-2">
    <label for="name" class="text-sm font-medium">Integration Name</label>
    <input 
      type="text" 
      id="name" 
      bind:value={name} 
      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary {errors.name ? 'border-destructive' : 'border-input'}"
    />
    {#if errors.name}
      <p class="text-sm text-destructive">{errors.name}</p>
    {/if}
  </div>
  
  <!-- Webhook URL field -->
  <div class="space-y-2">
    <label for="webhookUrl" class="text-sm font-medium">Webhook URL</label>
    <input 
      type="url" 
      id="webhookUrl" 
      bind:value={webhookUrl} 
      placeholder="https://hooks.slack.com/services/..."
      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary {errors.webhookUrl ? 'border-destructive' : 'border-input'}"
    />
    {#if errors.webhookUrl}
      <p class="text-sm text-destructive">{errors.webhookUrl}</p>
    {/if}
    <p class="text-xs text-muted-foreground">
      You can create a webhook URL in your Slack workspace settings.
      <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
        Learn more
      </a>
    </p>
  </div>
  
  <!-- Channel field -->
  <div class="space-y-2">
    <label for="channel" class="text-sm font-medium">Channel</label>
    <input 
      type="text" 
      id="channel" 
      bind:value={channel} 
      placeholder="#general"
      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary {errors.channel ? 'border-destructive' : 'border-input'}"
    />
    {#if errors.channel}
      <p class="text-sm text-destructive">{errors.channel}</p>
    {/if}
  </div>
  
  <!-- Username field -->
  <div class="space-y-2">
    <label for="username" class="text-sm font-medium">Bot Username</label>
    <input 
      type="text" 
      id="username" 
      bind:value={username} 
      placeholder="Manago Bot"
      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
    <p class="text-xs text-muted-foreground">
      This is the name that will appear as the sender of messages.
    </p>
  </div>
  
  <!-- Test result -->
  {#if testResult}
    <div class="p-3 rounded-md {testResult.success ? 'bg-green-100 text-green-800' : 'bg-destructive/10 text-destructive'}">
      {testResult.message || (testResult.success ? 'Test message sent successfully!' : 'Failed to send test message.')}
    </div>
  {/if}
  
  <!-- Action buttons -->
  <div class="flex justify-between pt-4">
    <div>
      <button 
        type="button" 
        on:click={testIntegration}
        disabled={isSubmitting}
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mr-2"
      >
        Test Connection
      </button>
      <button 
        type="button" 
        on:click={handleCancel}
        disabled={isSubmitting}
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        Cancel
      </button>
    </div>
    <button 
      type="submit" 
      disabled={isSubmitting}
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
    >
      {integration ? 'Update' : 'Add'} Integration
    </button>
  </div>
</form>