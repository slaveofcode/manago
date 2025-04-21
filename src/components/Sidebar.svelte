<script>
  import { Button } from "@/components/ui/button";
  import { writable } from 'svelte/store';
  
  // Create a store for the collapsed state
  const isCollapsed = writable(false);
  
  // Function to toggle sidebar
  function toggleSidebar() {
    $isCollapsed = !$isCollapsed;
  }
</script>

<div class={`h-full transition-all duration-300 border-r bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] ${$isCollapsed ? 'w-16' : 'w-64'}`}>
  <div class="flex h-14 items-center border-b px-4 justify-between">
    {#if !$isCollapsed}
      <span class="font-semibold">Dashboard</span>
    {/if}
    <button 
      class="p-1 rounded-sm hover:bg-[hsl(var(--sidebar-accent))]" 
      on:click={toggleSidebar}
      aria-label={$isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        {#if $isCollapsed}
          <polyline points="13 17 18 12 13 7"></polyline>
          <polyline points="6 17 11 12 6 7"></polyline>
        {:else}
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        {/if}
      </svg>
    </button>
  </div>
  
  <div class="py-4">
    <nav class="space-y-1 px-2">
      <a href="/dashboard" class={`flex items-center px-3 py-2 text-sm font-medium bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))] ${$isCollapsed ? 'justify-center' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" class={$isCollapsed ? 'mx-auto' : 'mr-3'} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        {#if !$isCollapsed}
          <span>Overview</span>
        {/if}
      </a>
      
      <a href="/dashboard/projects" class={`flex items-center px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))] ${$isCollapsed ? 'justify-center' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" class={$isCollapsed ? 'mx-auto' : 'mr-3'} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        {#if !$isCollapsed}
          <span>Projects</span>
        {/if}
      </a>
      
      <a href="/dashboard/tasks" class={`flex items-center px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))] ${$isCollapsed ? 'justify-center' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" class={$isCollapsed ? 'mx-auto' : 'mr-3'} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 11l3 3L22 4"></path>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
        {#if !$isCollapsed}
          <span>Tasks</span>
        {/if}
      </a>
      
      <a href="/dashboard/settings" class={`flex items-center px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))] ${$isCollapsed ? 'justify-center' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" class={$isCollapsed ? 'mx-auto' : 'mr-3'} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        {#if !$isCollapsed}
          <span>Settings</span>
        {/if}
      </a>
    </nav>
  </div>
</div>