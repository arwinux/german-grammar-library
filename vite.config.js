import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' lets the build work on any host or sub-path (Netlify, Vercel, GitHub Pages, ...)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1200,
    rolldownOptions: {
      output: {
        // lesson content is cached separately from app code and libraries
        codeSplitting: {
          groups: [
            { name: 'lessons', test: /lessons\.json/ },
            { name: 'vendor', test: /node_modules/ },
          ],
        },
      },
    },
  },
})
