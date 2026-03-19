/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint2';

export default defineConfig(() => ({
  plugins: [eslint()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    css: true,
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
      'https://dummy.supabase.co'
    ),
    'import.meta.env.VITE_PUBLISHABLE_API_KEY': JSON.stringify('dummy-key'),
  },
}));
