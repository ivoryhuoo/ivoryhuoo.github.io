import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps asset paths relative, so the built site works on any static host
// (tiiny.host, GitHub Pages, Netlify, Vercel) without extra config.
export default defineConfig({
  plugins: [react()],
  base: './',
});
