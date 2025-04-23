<script>
  import { onMount } from 'svelte';
  import SlackIntegration from './SlackIntegration.svelte';
  import IntegrationCard from './IntegrationCard.svelte';
  
  // Props
  export let initialIntegrations = [];
  // We'll use this as a constant since it's not being used directly in the component
  export const userId = '';
  
  // State
  let integrations = initialIntegrations;
  let loading = false;
  let error = null;
  let showAddModal = false;
  let integrationType = 'slack';
  
  // Available integration types
  const integrationTypes = [
    { id: 'slack', name: 'Slack', description: 'Send notifications to Slack channels', icon: 'slack' },
    { id: 'telegram', name: 'Telegram', description: 'Send notifications to Telegram channels (Coming Soon)', icon: 'telegram', disabled: true },
    { id: 'twitter', name: 'X (Twitter)', description: 'Post updates to X/Twitter (Coming Soon)', icon: 'twitter', disabled: true },
    { id: 'github', name: 'GitHub', description: 'Connect with GitHub repositories (Coming Soon)', icon: 'github', disabled: true },
    { id: 'gitlab', name: 'GitLab', description: 'Connect with GitLab repositories (Coming Soon)', icon: 'gitlab', disabled: true },
    { id: 'google', name: 'Google', description: 'Enable Google SSO login (Coming Soon)', icon: 'google', disabled: true }
  ];
  
  // Fetch integrations
  async function fetchIntegrations() {
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/integrations');
      const result = await response.json();
      
      if (result.success) {
        integrations = result.data;
      } else {
        error = result.message || 'Failed to fetch integrations';
      }
    } catch (err) {
      error = 'Error fetching integrations: ' + err.message;
    } finally {
      loading = false;
    }
  }
  
  // Create a new integration
  async function createIntegration(data) {
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        integrations = [...integrations, result.data];
        showAddModal = false;
      } else {
        error = result.message || 'Failed to create integration';
      }
    } catch (err) {
      error = 'Error creating integration: ' + err.message;
    } finally {
      loading = false;
    }
  }
  
  // Update an integration
  async function updateIntegration(id, data) {
    loading = true;
    error = null;
    
    try {
      const response = await fetch(`/api/integrations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        integrations = integrations.map(i => i.id === id ? result.data : i);
      } else {
        error = result.message || 'Failed to update integration';
      }
    } catch (err) {
      error = 'Error updating integration: ' + err.message;
    } finally {
      loading = false;
    }
  }
  
  // Delete an integration
  async function deleteIntegration(id) {
    loading = true;
    error = null;
    
    try {
      const response = await fetch(`/api/integrations/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        integrations = integrations.filter(i => i.id !== id);
      } else {
        error = result.message || 'Failed to delete integration';
      }
    } catch (err) {
      error = 'Error deleting integration: ' + err.message;
    } finally {
      loading = false;
    }
  }
  
  // Toggle integration enabled state
  async function toggleEnabled(id, enabled) {
    updateIntegration(id, { enabled });
  }
  
  // Handle integration update from card
  function handleUpdateIntegration(event) {
    showAddModal = true;
    integrationType = event.detail.type;
  }
  
  // Handle form submission
  function handleSubmit(event) {
    createIntegration(event.detail);
  }
  
  // Refresh integrations on mount
  onMount(() => {
    if (integrations.length === 0) {
      fetchIntegrations();
    }
  });
</script>

<div class="space-y-4">
  {#if error}
    <div class="bg-destructive/10 text-destructive p-3 rounded-md">
      {error}
    </div>
  {/if}
  
  {#if loading}
    <div class="text-center py-8">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <p class="mt-2 text-sm text-muted-foreground">Loading integrations...</p>
    </div>
  {:else if integrations.length > 0}
    <div class="grid gap-4">
      {#each integrations as integration (integration.id)}
        <IntegrationCard 
          integration={integration}
          on:delete={() => deleteIntegration(integration.id)}
          on:toggle={(e) => toggleEnabled(integration.id, e.detail)}
          on:update={() => window.location.href = `/dashboard/integrations/edit/${integration.id}`}
        />
      {/each}
    </div>
  {:else if !loading}
    <div class="text-center py-8 text-muted-foreground">
      <p>No integrations configured yet.</p>
    </div>
  {/if}
  
  <!-- Add new integration button -->
  <div class="mt-6">
    <a 
      href="/dashboard/integrations/add"
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
    >
      Add Integration
    </a>
  </div>
  
  <!-- Add integration modal -->
  {#if showAddModal}
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-card rounded-lg shadow-lg border border-border p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Add Integration</h2>
        
        <!-- Integration type selector -->
        <div class="mb-6">
          <p id="integration-type-label" class="text-sm font-medium mb-2">Select Integration Type</p>
          <div class="grid gap-2" role="radiogroup" aria-labelledby="integration-type-label">
            {#each integrationTypes as type}
              <button 
                class="flex items-center p-3 border rounded-md {integrationType === type.id ? 'border-primary' : 'border-input'} {type.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}"
                on:click={() => !type.disabled && (integrationType = type.id)}
                disabled={type.disabled}
                role="radio"
                aria-checked={integrationType === type.id}
              >
                <div class="mr-3">
                  <!-- Icon placeholder -->
                  <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {#if type.id === 'slack'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path>
                        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path>
                        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path>
                        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path>
                        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path>
                        <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path>
                        <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path>
                        <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path>
                      </svg>
                    {:else if type.id === 'telegram'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21.5 4.5 2.5 12.5 9.5 13.5 17.5 8.5 10.5 15.5 17.5 19.5 21.5 4.5"></path>
                        <path d="M9.5 13.5 9.5 19.5 12.5 16.5"></path>
                      </svg>
                    {:else if type.id === 'twitter'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    {:else if type.id === 'github'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    {:else if type.id === 'gitlab'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z"></path>
                      </svg>
                    {:else if type.id === 'google'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M17.13 17.21c-.95.3-1.87.44-3.13.44-3.64 0-5.88-2.36-5.88-5.7 0-3.15 2.42-5.7 5.83-5.7 3.23 0 5.37 2.14 5.37 4.93 0 .34-.04 1.16-.08 1.27H11.5v1.18h3.13c-.15.52-1.05 1.54-2.4 1.54-1.52 0-2.77-1.18-2.77-2.7 0-1.54 1.26-2.77 2.77-2.77.78 0 1.31.34 1.62.64l.97-.97c-.78-.74-1.83-1.15-2.9-1.15-2.4 0-4.34 1.94-4.34 4.34 0 2.4 1.94 4.34 4.34 4.34 2.32 0 4.2-1.54 4.2-3.8 0-.34-.04-.67-.08-.97h-4.12"></path>
                      </svg>
                    {:else}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    {/if}
                  </div>
                </div>
                <div class="flex-1">
                  <div class="font-medium">{type.name}</div>
                  <div class="text-xs text-muted-foreground">{type.description}</div>
                </div>
              </button>
            {/each}
          </div>
        </div>
        
        <!-- Integration form based on type -->
        {#if integrationType === 'slack'}
          <SlackIntegration 
            on:submit={handleSubmit}
            on:cancel={() => showAddModal = false}
          />
        {:else}
          <div class="text-center py-4">
            <p>This integration is not yet available.</p>
            <button 
              on:click={() => showAddModal = false}
              class="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>