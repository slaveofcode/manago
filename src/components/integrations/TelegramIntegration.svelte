<script>
  import { createEventDispatcher } from 'svelte';
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Props
  export let integration = null;
  
  // Form state
  let name = integration?.name || 'Telegram Integration';
  let botToken = integration?.config?.botToken || '';
  let chatId = integration?.config?.chatId || '';
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
    
    if (!botToken.trim()) {
      errors.botToken = 'Bot token is required';
    }
    
    if (!chatId.trim()) {
      errors.chatId = 'Chat ID is required';
    }
    
    // If there are errors, stop submission
    if (Object.keys(errors).length > 0) {
      isSubmitting = false;
      return;
    }
    
    // Prepare integration data
    const config = {
      botToken,
      chatId
    };
    
    // Dispatch event to parent component
    dispatch('submit', {
      type: 'telegram',
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
      placeholder="My Telegram Integration"
    />
    {#if errors.name}
      <p class="text-xs text-destructive">{errors.name}</p>
    {/if}
  </div>
  
  <!-- Bot Token -->
  <div class="space-y-2">
    <label for="botToken" class="text-sm font-medium">Bot Token</label>
    <input 
      type="text" 
      id="botToken" 
      bind:value={botToken}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
    />
    {#if errors.botToken}
      <p class="text-xs text-destructive">{errors.botToken}</p>
    {/if}
    <p class="text-xs text-muted-foreground">You can create a bot and get a token from <a href="https://t.me/BotFather" target="_blank" class="text-primary hover:underline">@BotFather</a> on Telegram.</p>
  </div>
  
  <!-- Chat ID -->
  <div class="space-y-2">
    <label for="chatId" class="text-sm font-medium">Chat ID</label>
    <input 
      type="text" 
      id="chatId" 
      bind:value={chatId}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="-1001234567890"
    />
    {#if errors.chatId}
      <p class="text-xs text-destructive">{errors.chatId}</p>
    {/if}
    <p class="text-xs text-muted-foreground">The chat ID where notifications will be sent. Add your bot to a group or channel and use @username_to_id_bot to find the chat ID.</p>
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