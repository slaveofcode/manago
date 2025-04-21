<script>
  import { Button } from "@/components/ui/button";
  import { theme, toggleTheme } from "@/lib/stores/theme.js";
  
  export let isAuthenticated = false;
</script>

<header class="fixed top-0 left-0 right-0 z-50 border-b bg-[hsl(var(--background))] shadow-sm">
  <div class="container flex h-14 items-center px-4">
    <div class="mr-auto">
      <a href="/" class="flex items-center">
        <span class="font-bold text-xl">Manago</span>
      </a>
    </div>
    
    <nav class="hidden md:flex items-center space-x-6">
      <a href="/" class="text-sm font-medium transition-colors hover:text-primary">
        Home
      </a>
      <a href="/features" class="text-sm font-medium transition-colors hover:text-primary">
        Features
      </a>
      <a href="/pricing" class="text-sm font-medium transition-colors hover:text-primary">
        Pricing
      </a>
    </nav>
    
    <div class="flex items-center space-x-4 ml-6">
      <!-- Theme toggle button -->
      <button 
        on:click={toggleTheme} 
        class="p-2 rounded-sm hover:bg-muted"
        aria-label={$theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
      >
        {#if $theme === 'dark'}
          <!-- Sun icon for dark mode -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        {:else}
          <!-- Moon icon for light mode -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        {/if}
      </button>
      
      {#if isAuthenticated}
        <a href="/dashboard">
          <Button variant="ghost" class="rounded-none">Dashboard</Button>
        </a>
        <Button variant="outline" class="rounded-none">Logout</Button>
      {:else}
        <a href="/login">
          <Button variant="ghost" class="rounded-none">Login</Button>
        </a>
        <a href="/register">
          <Button class="rounded-none">Sign Up</Button>
        </a>
      {/if}
    </div>
  </div>
</header>