<script>
  import { Button } from "@/components/ui/button";
  
  export let isAuthenticated = false;
</script>

<header class="fixed top-0 left-0 right-0 z-50 border-b bg-background">
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
    
    <div class="flex items-center space-x-2 ml-6">
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