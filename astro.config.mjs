// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],

  server: {
    port: Number(import.meta.env.SERVER_PORT || 8080),
    host: true,
  },

  output: 'server', // Change this to server

  adapter: node({
    mode: 'middleware'
  }),

  session: {
    driver: 'redis',
    options: {
      url: process.env.REDIS_URL,
    },
    ttl: 3600, // 1 hour
    cookie: {
      name: 'manago_session',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

});