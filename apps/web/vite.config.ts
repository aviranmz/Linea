import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Read version from package.json
const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  assetsInclude: ['**/*.xml', '**/*.txt'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3050,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9050',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:9050',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:9050',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 3050,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
  },
});
