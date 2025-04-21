import { writable } from 'svelte/store';
import { browser } from '@/lib/environment.js';

// Check if we're in the browser and if there's a theme preference in localStorage
const userTheme = browser && localStorage.getItem('theme');
// Check if the user prefers dark mode
const systemPrefersDark = browser && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Initialize theme based on user preference or system preference
const initialTheme = userTheme || (systemPrefersDark ? 'dark' : 'light');

// Create the theme store
export const theme = writable(initialTheme);

// Function to toggle theme
export function toggleTheme() {
  theme.update(currentTheme => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    if (browser) {
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
    return newTheme;
  });
}

// Initialize theme on page load
if (browser) {
  document.documentElement.classList.toggle('dark', initialTheme === 'dark');
}