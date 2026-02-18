/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint2';

export default defineConfig(() => ({
  plugins: [eslint()],
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
  },
}));
