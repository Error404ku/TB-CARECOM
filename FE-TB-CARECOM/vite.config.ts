import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // listen ke 0.0.0.0 agar bisa diakses dari luar container
    port: 5173,
  },
})
