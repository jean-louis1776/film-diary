import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react-oxc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  css: {
    modules: {
      // kebab-case → camelCase in TS: .film-grid → styles.filmGrid
      localsConvention: 'camelCaseOnly',
    },
  },
})
