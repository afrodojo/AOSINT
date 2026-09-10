import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Map workspace aliases if apps/web imports from packages/core
  resolve: {
    alias: {
      '@aosint/core': path.resolve(__dirname, '../../packages/core/src'),
      '@aosint/adapters': path.resolve(__dirname, '../../packages/osint-adapters/src'),
    },
  },
  build: {
    outDir: 'dist',
  },
});
