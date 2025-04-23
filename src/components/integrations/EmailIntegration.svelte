<script>
  import { createEventDispatcher } from 'svelte';
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Props
  export let integration = null;
  
  // Form state
  let name = integration?.name || 'Email Integration';
  let smtpServer = integration?.config?.smtpServer || '';
  let smtpPort = integration?.config?.smtpPort || '587';
  let username = integration?.config?.username || '';
  let password = integration?.config?.password || '';
  let fromEmail = integration?.config?.fromEmail || '';
  let fromName = integration?.config?.fromName || 'Manago Notifications';
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
    
    if (!smtpServer.trim()) {
      errors.smtpServer = 'SMTP server is required';
    }
    
    if (!smtpPort.trim()) {
      errors.smtpPort = 'SMTP port is required';
    }
    
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!password.trim()) {
      errors.password = 'Password is required';
    }
    
    if (!fromEmail.trim()) {
      errors.fromEmail = 'From email is required';
    } else if (!fromEmail.includes('@')) {
      errors.fromEmail = 'Please enter a valid email address';
    }
    
    // If there are errors, stop submission
    if (Object.keys(errors).length > 0) {
      isSubmitting = false;
      return;
    }
    
    // Prepare integration data
    const config = {
      smtpServer,
      smtpPort,
      username,
      password,
      fromEmail,
      fromName: fromName.trim() || undefined
    };
    
    // Dispatch event to parent component
    dispatch('submit', {
      type: 'email',
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
      placeholder="My Email Integration"
    />
    {#if errors.name}
      <p class="text-xs text-destructive">{errors.name}</p>
    {/if}
  </div>
  
  <!-- SMTP Server -->
  <div class="space-y-2">
    <label for="smtpServer" class="text-sm font-medium">SMTP Server</label>
    <input 
      type="text" 
      id="smtpServer" 
      bind:value={smtpServer}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="smtp.gmail.com"
    />
    {#if errors.smtpServer}
      <p class="text-xs text-destructive">{errors.smtpServer}</p>
    {/if}
  </div>
  
  <!-- SMTP Port -->
  <div class="space-y-2">
    <label for="smtpPort" class="text-sm font-medium">SMTP Port</label>
    <input 
      type="text" 
      id="smtpPort" 
      bind:value={smtpPort}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="587"
    />
    {#if errors.smtpPort}
      <p class="text-xs text-destructive">{errors.smtpPort}</p>
    {/if}
    <p class="text-xs text-muted-foreground">Common ports: 25, 465 (SSL), 587 (TLS)</p>
  </div>
  
  <!-- Username -->
  <div class="space-y-2">
    <label for="username" class="text-sm font-medium">Username</label>
    <input 
      type="text" 
      id="username" 
      bind:value={username}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="your.email@example.com"
    />
    {#if errors.username}
      <p class="text-xs text-destructive">{errors.username}</p>
    {/if}
  </div>
  
  <!-- Password -->
  <div class="space-y-2">
    <label for="password" class="text-sm font-medium">Password</label>
    <input 
      type="password" 
      id="password" 
      bind:value={password}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="••••••••"
    />
    {#if errors.password}
      <p class="text-xs text-destructive">{errors.password}</p>
    {/if}
    <p class="text-xs text-muted-foreground">For Gmail, you may need to use an app password.</p>
  </div>
  
  <!-- From Email -->
  <div class="space-y-2">
    <label for="fromEmail" class="text-sm font-medium">From Email</label>
    <input 
      type="email" 
      id="fromEmail" 
      bind:value={fromEmail}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="notifications@yourdomain.com"
    />
    {#if errors.fromEmail}
      <p class="text-xs text-destructive">{errors.fromEmail}</p>
    {/if}
  </div>
  
  <!-- From Name -->
  <div class="space-y-2">
    <label for="fromName" class="text-sm font-medium">From Name (Optional)</label>
    <input 
      type="text" 
      id="fromName" 
      bind:value={fromName}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="Manago Notifications"
    />
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