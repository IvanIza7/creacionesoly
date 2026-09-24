import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api requests to backend
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      // Proxy /uploads requests to backend (so image URLs can be relative)
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
