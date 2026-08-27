import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://host.docker.internal:3000',
        changeOrigin: true,
      },
    },
    watch: {
      // Docker on Windows doesn't forward inotify events — polling is required
      usePolling: true,
      interval: 300,
    },
    host: true,
    port: 5173,
  },
})
