import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages serves under /Hoc_lieu_so/. Override with VITE_BASE for other deploys.
  base: process.env.VITE_BASE ?? '/Hoc_lieu_so/',
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: 5180,
    allowedHosts: true,
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
})
