import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/music-learning-site-v3/',
  plugins: [react()],
  server: {
    open: true
  }
});
