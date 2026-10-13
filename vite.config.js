import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['axios'],
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://baiderken.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
