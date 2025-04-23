<script>
  import { createEventDispatcher } from 'svelte';
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Props
  export let integration = null;
  
  // Form state
  let name = integration?.name || 'Rocket.Chat Integration';
  let webhookUrl = integration?.config?.webhookUrl || '';
  let channel = integration?.config?.channel || '';
  let username = integration?.config?.username || 'Manago Bot';
  let isSubmitting = false;
  let submitSuccess = false;
  let errors = {};
  
  // Handle form submission
  async function handleSubmit() {
    isSubmitting = true;
    errors = {};
    
    // Validate form
    if (!name.trim()) {
      errors.name = 'Integration name is required';
    }
    
    if (!webhookUrl.trim()) {
      errors.webhookUrl = 'Webhook URL is required';
    } else if (!webhookUrl.startsWith('http')) {
      errors.webhookUrl = 'Please enter a valid URL';
    }
    
    // If there are errors, stop submission
    if (Object.keys(errors).length > 0) {
      isSubmitting = false;
      return;
    }
    
    // Prepare integration data
    const config = {
      webhookUrl,
      channel: channel.trim() || undefined,
      username: username.trim() || undefined
    };
    
    // Dispatch event to parent component
    dispatch('submit', {
      type: 'rocketchat',
      name,
      config,
      enabled: true
    });
    
    // Reset form
    submitSuccess = true;
    isSubmitting = false;
  }
  
  // Handle cancel
  function handleCancel() {
    dispatch('cancel');
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  {#if submitSuccess}
    <div class="bg-green-50 text-green-600 p-3 rounded-md">
      Integration saved successfully!
    </div>
  {/if}
  
  {#if errors.submit}
    <div class="bg-destructive/10 text-destructive p-3 rounded-md">
      {errors.submit}
    </div>
  {/if}
  
  <!-- Integration Name -->
  <div class="space-y-2">
    <label for="name" class="text-sm font-medium">Integration Name</label>
    <input 
      type="text" 
      id="name" 
      bind:value={name}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="My Rocket.Chat Integration"
    />
    {#if errors.name}
      <p class="text-xs text-destructive">{errors.name}</p>
    {/if}
  </div>
  
  <!-- Webhook URL -->
  <div class="space-y-2">
    <label for="webhookUrl" class="text-sm font-medium">Webhook URL</label>
    <input 
      type="url" 
      id="webhookUrl" 
      bind:value={webhookUrl}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="https://your-rocketchat-server.com/hooks/..."
    />
    {#if errors.webhookUrl}
      <p class="text-xs text-destructive">{errors.webhookUrl}</p>
    {/if}
    <p class="text-xs text-muted-foreground">You can create a webhook in your Rocket.Chat workspace settings.</p>
  </div>
  
  <!-- Channel -->
  <div class="space-y-2">
    <label for="channel" class="text-sm font-medium">Channel (Optional)</label>
    <input 
      type="text" 
      id="channel" 
      bind:value={channel}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="#general"
    />
    <p class="text-xs text-muted-foreground">The channel where notifications will be sent. Leave empty to use the webhook default.</p>
  </div>
  
  <!-- Username -->
  <div class="space-y-2">
    <label for="username" class="text-sm font-medium">Bot Username (Optional)</label>
    <input 
      type="text" 
      id="username" 
      bind:value={username}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="Manago Bot"
    />
    <p class="text-xs text-muted-foreground">The username that will appear when sending messages.</p>
  </div>
  
  <!-- Form Actions -->
  <div class="flex justify-between pt-4">
    <button 
      type="button" 
      on:click={handleCancel}
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
    >
      Cancel
    </button>
    <button 
      type="submit" 
      disabled={isSubmitting}
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
    >
      {integration ? 'Update' : 'Add'} Integration
    </button>
  </div>
</form>