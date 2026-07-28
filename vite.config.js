import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this repo from /G10x-Website/, so every asset URL has
  // to be prefixed or the built index.html requests /assets/* from the domain
  // root and renders a blank page. Overridable for a custom domain / local
  // preview via BASE_PATH=/ npm run build.
  base: process.env.BASE_PATH ?? '/G10x-Website/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    // three.js is code-split behind React.lazy; its chunk is legitimately large.
    chunkSizeWarningLimit: 900,
  },
})
