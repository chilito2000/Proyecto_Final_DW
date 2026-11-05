import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' => todos los recursos del build usan rutas relativas
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173 },
});
