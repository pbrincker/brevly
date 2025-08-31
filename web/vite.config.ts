import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true
  },
  preview: {
    port: 5174,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // Configuração para SPA - redireciona todas as rotas para index.html
  appType: 'spa'
})
