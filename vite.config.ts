import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Required for SPA routing: any unknown path falls back to index.html
  // so react-router handles it client-side
  server: {
    historyApiFallback: true,
  },

  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
