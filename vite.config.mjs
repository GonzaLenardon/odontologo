import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3006,
    open: true,
  },
  build: {
    outDir: 'dist',
    // La app incluye MUI + todas las vistas; el bundle único es esperable.
    chunkSizeWarningLimit: 900,
  },
  // GitHub Pages sirve la app en /odontologo/
  base: '/odontologo/',
});
