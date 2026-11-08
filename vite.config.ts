import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the static build works on GitHub Pages / Netlify subpaths.
  base: './',
  plugins: [react(), tailwindcss()],
})
